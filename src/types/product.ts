import type { IDateValue } from './common';

export type TProductBrand = {
  id: string;
  name: string;
  slug: string;
  icon?: string;
};

export type TProductCategory = {
  id: string;
  title: string;
  slug: string;
  icon?: string;
};

export type TProductSpecificationItem = {
  heading: string;
  fields: { title: string; value: string }[];
};

export type TProductAttributeItem = { slug: string; value: string[] };

export type IProduct = {
  id: string;
  name: string;
  slug: string;
  model: string;
  code?: string;
  price: number;
  discount_price?: number;
  retailer_price?: number;
  stock: number;
  brand_id?: string;
  brand: TProductBrand;
  categories?: TProductCategory[];
  thumbnail?: string;
  images: string[];
  video_url?: string;
  tags: string[];
  description?: string;
  specification?: TProductSpecificationItem[];
  additional_information?: string;
  key_features: string[];
  attributes: TProductAttributeItem[];
  published: boolean;
  featured: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

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
