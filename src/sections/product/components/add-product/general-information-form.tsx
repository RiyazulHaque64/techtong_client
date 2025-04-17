import { Grid } from '@mui/material';

import { CONFIG } from 'src/config-global';
import { useGetBrandsQuery } from 'src/redux/features/brand/brandApi';
import { useGetCategoriesQuery } from 'src/redux/features/category/categoryApi';

import { Field } from 'src/components/hook-form';

export default function GeneralInformationForm() {
  const { data: categories } = useGetCategoriesQuery([
    { name: 'limit', value: CONFIG.search_query.limit },
    { name: 'sortBy', value: 'title' },
    { name: 'sortOrder', value: 'asc' },
  ]);
  const { data: brands } = useGetBrandsQuery([
    { name: 'limit', value: CONFIG.search_query.limit },
    { name: 'sortBy', value: 'name' },
    { name: 'sortOrder', value: 'asc' },
  ]);

  const categoriesOptions =
    categories?.data?.map((category) => ({ label: category.title, value: category.id })) || [];
  const brandsOptions =
    brands?.data?.map((brand) => ({ label: brand.name, value: brand.id })) || [];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Field.Text name="name" label="Name*" />
      </Grid>
      <Grid item xs={12} md={4}>
        <Field.Text name="model" label="Model*" />
      </Grid>
      <Grid item xs={12} md={4}>
        <Field.Text name="code" label="Code" />
      </Grid>
      <Grid item xs={12} md={4}>
        <Field.Text name="warranty" label="Warranty" />
      </Grid>
      <Grid item xs={12} md={6}>
        <Field.AutoComplete name="category" options={categoriesOptions} label="Category" multiple />
      </Grid>
      <Grid item xs={12} md={6}>
        <Field.AutoComplete name="brand" options={brandsOptions} label="Brand" />
      </Grid>
    </Grid>
  );
}
