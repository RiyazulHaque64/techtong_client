import type { IDateValue } from './common';

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  model: string;
  brand_id?: string;
  tags?: string[];
  code?: string;
  stock: number;
  price: number;
  discount_price?: number;
  retailer_price?: number;
  thumbnail?: string;
  images?: string[];
  published: boolean;
  featured: boolean;
  description?: string;
  specification?: { heading: string; fields: { title: string; value: string }[] }[];
  additional_information?: string;
  key_features?: string[];
  video_url?: string;
  attributes?: { slug: string; value: string }[];
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  categories?: string[];
}

// ----------------------------------------------------------------------

export type IProductFilters = {
  rating: string;
  gender: string[];
  category: string;
  colors: string[];
  priceRange: number[];
};

export type IProductTableFilters = {
  stock: string[];
  publish: string[];
};

export type IProductReviewNewForm = {
  rating: number | null;
  review: string;
  name: string;
  email: string;
};

export type IProductReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  helpful: number;
  avatarUrl: string;
  postedAt: IDateValue;
  isPurchased: boolean;
  attachments?: string[];
};

export type IProductItem = {
  id: string;
  sku: string;
  name: string;
  code: string;
  price: number;
  taxes: number;
  tags: string[];
  sizes: string[];
  publish: string;
  gender: string[];
  coverUrl: string;
  images: string[];
  colors: string[];
  quantity: number;
  category: string;
  available: number;
  totalSold: number;
  description: string;
  totalRatings: number;
  totalReviews: number;
  createdAt: IDateValue;
  inventoryType: string;
  subDescription: string;
  priceSale: number | null;
  reviews: IProductReview[];
  ratings: {
    name: string;
    starCount: number;
    reviewCount: number;
  }[];
  saleLabel: {
    enabled: boolean;
    content: string;
  };
  newLabel: {
    enabled: boolean;
    content: string;
  };
};
