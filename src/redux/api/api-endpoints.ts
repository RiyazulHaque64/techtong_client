const features = {
  auth: '/auth',
  user: '/user',
  image: '/image',
  brand: '/brand',
  category: '/category',
  attribute: '/attribute',
  product: '/product',
};

const api_endpoint = {
  auth: {
    login: `${features.auth}/login`,
    forgot_password: `${features.auth}/forgot-password`,
    change_password: `${features.auth}/reset-password`,
  },
  user: {
    update_profile: `${features.user}/update-profile`,
  },
  image: {
    upload_images: `${features.image}/upload-images`,
    get_images: `${features.image}`,
    update_image: `${features.image}/update`,
    delete_image: `${features.image}/delete-images`,
  },
  brand: {
    add_brand: `${features.brand}/add-brand`,
    get_brands: `${features.brand}`,
    update_brand: `${features.brand}`,
    delete_brand: `${features.brand}/delete-brand`,
  },
  category: {
    add_category: `${features.category}/add-category`,
    get_categories: `${features.category}`,
    update_category: `${features.category}`,
    delete_category: `${features.category}/delete-category`,
  },
  attribute: {
    add_attribute: `${features.attribute}/add-attribute`,
    get_attributes: `${features.attribute}`,
    update_attribute: `${features.attribute}`,
    delete_attributes: `${features.attribute}/delete-attribute`,
  },
  product: {
    add_product: `${features.product}/add-product`,
    get_products: `${features.product}`,
    update_product: `${features.product}/update-product`,
    delete_products: `${features.product}`,
  },
};

export default api_endpoint;
