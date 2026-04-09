export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  priceGbp: number; // in pence
  comparePrice: number | null;
  category: ProductCategory;
  tags: string[];
  features: Feature[];
  techStack: string[];
  previewImages: string[];
  liveDemoUrl: string | null;
  filePath: string;
  fileSizeBytes: number;
  version: string;
  status: "draft" | "published" | "archived";
  pageCount: number;
  componentCount: number;
  reviewCount: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory = "erp" | "analytics" | "saas" | "crm";

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Review {
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
}

export interface Purchase {
  id: string;
  productId: string;
  product?: Product;
  amountGbp: number;
  status: "completed" | "refunded";
  createdAt: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  maxUses: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  productIds: string[] | null;
}

export interface Subscriber {
  id: string;
  email: string;
  source: string;
  subscribed: boolean;
  createdAt: string;
}
