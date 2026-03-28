import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";

const VIEW_COOKIE_PREFIX = "stitch-product-viewed-";
const VIEW_COOKIE_AGE_SECONDS = 60 * 60 * 12;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieName = `${VIEW_COOKIE_PREFIX}${id}`;
  const alreadyCounted = request.cookies.get(cookieName)?.value === "1";

  const product = alreadyCounted
    ? await prisma.product.findUnique({
        where: { id },
        select: { viewCount: true, published: true },
      })
    : await prisma.product.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
        select: { viewCount: true, published: true },
      }).catch(() => null);

  if (!product || !product.published) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const response = NextResponse.json({ viewCount: product.viewCount });

  if (!alreadyCounted) {
    response.cookies.set(cookieName, "1", {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: VIEW_COOKIE_AGE_SECONDS,
    });
  }

  return response;
}
