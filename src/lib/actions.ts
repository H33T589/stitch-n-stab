"use server";

import { prisma } from "./db";
import { createSession, destroySession } from "./auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

async function saveUploadedImage(file: File): Promise<string> {
  if (file.size === 0) {
    throw new Error("Empty file");
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop() || "jpg";
  const baseName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
  const pathname = `products/${baseName}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(pathname, buffer, { access: "public" });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Image upload needs Vercel Blob. In Vercel: Storage → Blob → Create store, link it to this project, then redeploy."
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, baseName), buffer);
  return `/uploads/${baseName}`;
}

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

  for (const file of files) {
    if (file.size === 0) continue;
    imageUrls.push(await saveUploadedImage(file));
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
