"use server";

import { prisma } from "./db";
import { createSession, destroySession } from "./auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function login(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    await createSession();
    redirect("/admin");
  }

  return { error: "Invalid username or password" };
}

export async function logout() {
  await destroySession();
  redirect("/");
}

export async function createProduct(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priceStr = formData.get("price") as string;
  const files = formData.getAll("images") as File[];

  const price = priceStr ? parseFloat(priceStr) : null;

  const imageUrls: string[] = [];
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  for (const file of files) {
    if (file.size === 0) continue;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    await writeFile(path.join(uploadDir, filename), buffer);
    imageUrls.push(`/uploads/${filename}`);
  }

  await prisma.product.create({
    data: {
      title,
      description: description || "",
      price: price && !isNaN(price) ? price : null,
      imageUrls: JSON.stringify(imageUrls),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function toggleSold(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  await prisma.product.update({
    where: { id },
    data: { sold: !product.sold },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function togglePublished(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  await prisma.product.update({
    where: { id },
    data: { published: !product.published },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}
