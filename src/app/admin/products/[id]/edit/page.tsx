import { notFound } from "next/navigation";
import { prisma } from "@/server/db";
import { EditProductForm } from "@/components/admin/edit-product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) notFound();

  let imageUrls: string[] = [];
  try {
    const parsed = JSON.parse(product.imageUrls);
    imageUrls = Array.isArray(parsed)
      ? parsed.filter((u): u is string => typeof u === "string")
      : [];
  } catch {
    imageUrls = [];
  }

  return (
    <EditProductForm
      product={{
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        onSale: product.onSale,
        imageUrls,
      }}
    />
  );
}
