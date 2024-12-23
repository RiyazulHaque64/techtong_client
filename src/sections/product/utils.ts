import type { ProductValidationSchemaType } from './manage-product-form';

export type TProductInfo = {
  name: string;
  model: string;
  price: number;
  discount_price?: number;
  retailer_price?: number;
  stock?: number;
  attributes?: { slug: string; value: string }[];
  brand_id?: string;
  categories?: string[];
  video_url?: string;
  thumbnail?: string;
  images?: string[];
};

export const attributesFormatter = (attributes: Record<string, any> | undefined) => {
  if (!attributes) return [];
  const attributesArr = Object.keys(attributes).filter(
    (item) => attributes[item]?.value !== undefined
  );
  const formattedAttributes = attributesArr.map((item) => ({
    slug: item,
    value: attributes[item]?.value,
  }));
  return formattedAttributes;
};

export const catgoriesFormatter = (categories: { label: string; value: string }[]) => {
  const formattedCategories = categories.map((item) => item.value);
  return formattedCategories;
};

export const productInfoFormatter = (productData: ProductValidationSchemaType) => {
  const {
    name,
    model,
    price,
    discount_price,
    retailer_price,
    stock,
    attributes,
    brand,
    category,
    video_url,
    thumbnail,
    images,
  } = productData;
  const productInfo: TProductInfo = {
    name,
    model,
    price,
  };

  if (discount_price > 0) productInfo.discount_price = discount_price;
  if (retailer_price > 0) productInfo.retailer_price = retailer_price;
  if (stock > 0) productInfo.stock = stock;
  const formattedAttributes = attributesFormatter(attributes);
  if (formattedAttributes.length) productInfo.attributes = formattedAttributes;
  if (brand) productInfo.brand_id = brand.value;
  if (category.length) productInfo.categories = catgoriesFormatter(category);
  if (video_url.length) productInfo.video_url = video_url;
  if (thumbnail.length) productInfo.thumbnail = thumbnail[0];
  if (images.length) productInfo.images = images;

  return productInfo;
};
