import { NextRequest, NextResponse } from "next/server";
import { getReviewsByProductId } from "@/lib/mock-data";

// GET /api/reviews?productId=xxx
// Returns reviews for a product
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { error: "productId is required" },
      { status: 400 }
    );
  }

  const reviews = getReviewsByProductId(productId);
  return NextResponse.json({ reviews });
}

// POST /api/reviews
// Submit a new review (requires authentication + verified purchase)
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

    // TODO: Implement review submission
    // 1. Verify user is authenticated
    // 2. Verify user has purchased the product
    // 3. Check user hasn't already reviewed this product
    // 4. Create review record (approved: false for moderation)
    // 5. Send notification email to admin

    return NextResponse.json(
      { message: "Review submitted for moderation" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
