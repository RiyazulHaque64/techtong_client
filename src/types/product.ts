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

export type TProductAttributeItem = { title: string; value: string[] };

export type TProductReview = {
  id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  user: {
    name: string;
    email?: string;
    profile_pic?: string;
  };
};

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
  avg_rating: number;
  reviews: TProductReview[];
};

// ----------------------------------------------------------------------

export type IProductTableFilters = {
  stock: string[];
  publish: string[];
};
