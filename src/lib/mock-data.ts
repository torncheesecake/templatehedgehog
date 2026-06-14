type Review = {
  id: string;
  productId: string;
  customerName: string;
  customerRole: string;
  customerCompany: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
};

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "template_hedgehog_pro",
    customerName: "James Chen",
    customerRole: "Lifecycle engineering lead",
    customerCompany: "Meridian Consulting",
    rating: 5,
    title: "Clean production handoff",
    body: "The MJML and compiled HTML pairing gave our team a dependable starting point for operational email without rebuilding the same structures again.",
    verified: true,
    createdAt: "2026-01-28T00:00:00Z",
  },
  {
    id: "r2",
    productId: "template_hedgehog_pro",
    customerName: "Sarah Mitchell",
    customerRole: "Technical lead",
    customerCompany: "Apex Digital",
    rating: 5,
    title: "Useful beyond the first send",
    body: "The system is organised around layouts, source, and QA notes, which made it easier to standardise transactional and lifecycle email across projects.",
    verified: true,
    createdAt: "2026-02-05T00:00:00Z",
  },
  {
    id: "r3",
    productId: "template_hedgehog_enterprise",
    customerName: "David Park",
    customerRole: "Independent developer",
    customerCompany: "",
    rating: 5,
    title: "Clear reuse model",
    body: "Team licensing made the reuse rights clear enough for client delivery, and the generation framework avoided another round of one-off email assembly.",
    verified: true,
    createdAt: "2026-02-12T00:00:00Z",
  },
];

export function getReviewsByProductId(productId: string): Review[] {
  return reviews.filter((review) => review.productId === productId);
}
