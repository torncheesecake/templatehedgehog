import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { error: "productId is required" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    reviews: [],
    message: "Verified customer reviews are not published until moderated purchase verification is available.",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, rating, title, body: reviewBody } = body;

    if (!productId || !rating || !title || !reviewBody) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Review submission is only available after verified purchase moderation is connected.",
      },
      { status: 403 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
