"use server";

import { prisma } from "@/server/db";
import { createSession, destroySession } from "@/server/auth";
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

const MAX_PHOTOS = 6;

function parseProductPricing(formData: FormData) {
  const onSale = formData.get("onSale") === "true";
  const priceStr = (formData.get("price") as string)?.trim() ?? "";
  const compareStr = (formData.get("compareAtPrice") as string)?.trim() ?? "";

  const price = priceStr ? parseFloat(priceStr) : null;
  const compareAtPrice = compareStr ? parseFloat(compareStr) : null;

  if (onSale) {
    if (price == null || Number.isNaN(price)) {
      throw new Error("Sale price is required when the listing is on sale.");
    }
    if (compareAtPrice == null || Number.isNaN(compareAtPrice)) {
      throw new Error("Original price is required when the listing is on sale.");
    }
    if (compareAtPrice <= price) {
      throw new Error("Original price must be higher than the sale price.");
    }
    return { onSale: true, price, compareAtPrice };
  }

  return {
    onSale: false,
    price: price != null && !Number.isNaN(price) ? price : null,
    compareAtPrice: null as number | null,
  };
}

export async function createProduct(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const files = formData.getAll("images") as File[];

  const pricing = parseProductPricing(formData);

  const validFiles = files.filter((f) => f.size > 0).slice(0, MAX_PHOTOS);
  const imageUrls: string[] = [];

  for (const file of validFiles) {
    imageUrls.push(await saveUploadedImage(file));
  }

  await prisma.product.create({
    data: {
      title,
      description: description || "",
      price: pricing.price,
      compareAtPrice: pricing.compareAtPrice,
      onSale: pricing.onSale,
      imageUrls: JSON.stringify(imageUrls),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateProduct(id: string, formData: FormData) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Product not found");
  }

  const title = (formData.get("title") as string)?.trim() ?? "";
  if (!title) {
    throw new Error("Product name is required.");
  }
  const description = (formData.get("description") as string) ?? "";
  const pricing = parseProductPricing(formData);

  const keptUrls = formData
    .getAll("existingImages")
    .filter((v): v is string => typeof v === "string" && v.length > 0);

  const files = formData.getAll("images").filter(
    (f): f is File => f instanceof File && f.size > 0
  );

  if (keptUrls.length + files.length > MAX_PHOTOS) {
    throw new Error(`Maximum ${MAX_PHOTOS} photos per listing.`);
  }

  const priorUrls: string[] = JSON.parse(existing.imageUrls);
  const allowed = new Set(priorUrls);
  const sanitizedKept = keptUrls.filter((url) => allowed.has(url));

  const newUrls: string[] = [];
  for (const file of files) {
    newUrls.push(await saveUploadedImage(file));
  }

  const imageUrls = [...sanitizedKept, ...newUrls];

  await prisma.product.update({
    where: { id },
    data: {
      title,
      description: description || "",
      price: pricing.price,
      compareAtPrice: pricing.compareAtPrice,
      onSale: pricing.onSale,
      imageUrls: JSON.stringify(imageUrls),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/products/${id}`);
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

/** One listing at a time: shows as the large “Highlight” card on the homepage. */
export async function setHomepageFeatured(id: string) {
  const exists = await prisma.product.findUnique({ where: { id } });
  if (!exists) return;

  await prisma.$transaction([
    prisma.product.updateMany({ data: { featured: false } }),
    prisma.product.update({
      where: { id },
      data: { featured: true },
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function clearHomepageFeatured() {
  await prisma.product.updateMany({ data: { featured: false } });
  revalidatePath("/");
  revalidatePath("/admin");
}
