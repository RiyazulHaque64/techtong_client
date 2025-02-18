import type { IProduct } from 'src/types/product';
import type { UseFormSetValue } from 'react-hook-form';

import { startCase } from 'lodash';

import type { ProductValidationSchemaType } from './manage-product-form';

export type TProductInfo = {
  name: string;
  model: string;
  code?: string;
  price: number;
  discount_price?: number;
  retailer_price?: number;
  stock?: number;
  attributes?: { title: string; value: string }[];
  brand_id?: string;
  categories?: { id: string }[];
  video_url?: string;
  thumbnail?: string;
  images?: string[];
  tags?: string[];
  key_features?: string[];
  additional_information?: string;
  description?: string;
  specification?: { heading: string; fields: { title: string; value: string }[] }[];
};

export const attributesFormatter = (attributes: Record<string, any> | undefined) => {
  if (!attributes) return [];
  const attributesArr = Object.keys(attributes).filter((item) => attributes[item].length !== 0);

  const formattedAttributes = attributesArr.map((item) => ({
    title: item,
    value: attributes[item].map((i: { label: string; value: string }) => i.value),
  }));
  return formattedAttributes;
};

export const attributesParser = (
  formattedAttributes: { title: string; value: string[] }[]
): Record<string, { label: string; value: string }[]> => {
  const attributes: Record<string, { label: string; value: string }[]> = {};

  formattedAttributes.forEach(({ title, value }) => {
    attributes[title] = value.map((item) => ({
      label: startCase(item),
      value: item,
    }));
  });

  return attributes;
};

export const catgoriesFormatter = (categories: { label: string; value: string }[]) => {
  const formattedCategories = categories.map((item) => ({ id: item.value }));
  return formattedCategories;
};

export const productInfoFormatter = (productData: ProductValidationSchemaType) => {
  const {
    name,
    model,
    code,
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
    tags,
    key_features,
    description,
    additional_information,
    specification,
  } = productData;
  const productInfo: TProductInfo = {
    name,
    model,
    price,
  };

  if (code) productInfo.code = code;
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
  if (tags.length) productInfo.tags = tags;
  if (key_features.length) productInfo.key_features = key_features;
  if (additional_information) productInfo.additional_information = additional_information;
  if (description) productInfo.description = description;
  if (specification[0].heading) productInfo.specification = specification;

  return productInfo;
};

export const resetProductForm = (
  product: IProduct,
  setValue: UseFormSetValue<ProductValidationSchemaType>
) => {
  setValue('name', product.name);
  setValue('model', product.model);
  setValue('code', product.code);
  setValue('price', product.price);
  setValue('discount_price', product?.discount_price || 0);
  setValue('retailer_price', product?.retailer_price || 0);
  setValue('stock', product.stock);
  setValue('video_url', product?.video_url || '');
  setValue('brand', product?.brand ? { label: product.brand.name, value: product.brand.id } : null);
  setValue(
    'category',
    product?.categories
      ? product.categories?.map((item) => ({ label: item.title, value: item.id }))
      : []
  );
  setValue('tags', product?.tags || []);
  setValue('key_features', product?.key_features || []);
  setValue('description', product?.description || '');
  setValue('additional_information', product?.additional_information || '');
  setValue('thumbnail', product?.thumbnail ? [product.thumbnail] : []);
  setValue('images', product?.images || []);
  setValue(
    'attributes',
    product.attributes
      ? attributesParser(product.attributes)
      : {
          Availability: [],
        }
  );
  if (product?.specification) {
    setValue('specification', product.specification);
  }
};

export const PRODUCT_TAB_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'featured', label: 'Featured' },
];

export const PRODUCT_DETAILS_TABS = [
  { value: 'specification', label: 'Specification' },
  { value: 'description', label: 'Description' },
  { value: 'additional_information', label: 'Additional Information' },
  { value: 'video', label: 'Video' },
  { value: 'attributes', label: 'Attributes' },
];

export const RATINGS = [
  {
    title: '5 Star',
    value: '5',
  },
  {
    title: '4 Star',
    value: '4',
  },
  {
    title: '3 Star',
    value: '3',
  },
  {
    title: '2 Star',
    value: '2',
  },
  {
    title: '1 Star',
    value: '1',
  },
];

export type TFilterOption = { value: string; label: string };

export const STOCK_STATUS_DEFAULT_OPTION: TFilterOption = { value: '', label: 'Stock status' };
export const BRAND_FILTER_DEFAULT_OPTION: TFilterOption = { value: '', label: 'Select brand' };
export const CATEGORY_FILTER_DEFAULT_OPTION: TFilterOption = {
  value: '',
  label: 'Select category',
};
