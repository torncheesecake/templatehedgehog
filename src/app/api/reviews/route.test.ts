import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";

test("GET /api/reviews returns an empty verified-review list", async () => {
  const request = new NextRequest("http://localhost:3000/api/reviews?productId=template_hedgehog_pro");
  const response = await GET(request);
  const payload = await response.json() as { reviews: unknown[] };

  assert.equal(response.status, 200);
  assert.deepEqual(payload.reviews, []);
});

test("GET /api/reviews requires a productId", async () => {
  const request = new NextRequest("http://localhost:3000/api/reviews");
  const response = await GET(request);

  assert.equal(response.status, 400);
});

test("POST /api/reviews blocks unverified submissions", async () => {
  const request = new NextRequest("http://localhost:3000/api/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId: "template_hedgehog_pro",
      rating: 5,
      title: "Useful",
      body: "Useful production system.",
    }),
  });
  const response = await POST(request);

  assert.equal(response.status, 403);
});
