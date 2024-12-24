import type { TOptionItem } from 'src/components/hook-form/rhf-auto-complete';

import { z as zod } from 'zod';
import { startCase } from 'lodash';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import { Box, Card, Grid, Stack, Button, Typography, InputAdornment } from '@mui/material';

import { useDebounce } from 'src/hooks/use-debounce';

import { useGetBrandsQuery } from 'src/redux/features/brand/brandApi';
import { useGetCategoriesQuery } from 'src/redux/features/category/categoryApi';
import { useGetAttributesQuery } from 'src/redux/features/attribute/attributeApi';

import { Form, Field } from 'src/components/hook-form';

import { productInfoFormatter } from './utils';

export const ProductValidationSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  model: zod.string().min(1, { message: 'Model is required!' }),
  code: zod.string().optional(),
  brand: zod
    .object({
      label: zod.string(),
      value: zod.string(),
    })
    .nullable()
    .optional(),
  category: zod.array(zod.object({ label: zod.string(), value: zod.string() })).default([]),
  price: zod
    .number()
    .nonnegative({ message: 'Price should be greater than 0' })
    .min(1, 'Price is required'),
  discount_price: zod.number().nonnegative('Discount price should be greater than 0'),
  retailer_price: zod.number().nonnegative('Retailer price should be greater than 0'),
  stock: zod.number().nonnegative('Stock should not be negative'),
  attributes: zod.record(zod.string(), zod.any()).optional(),
  video_url: zod.union([
    zod.string().length(0, 'Video URL should be a valid URL'),
    zod.string().url({ message: 'Video URL should be a valid URL' }),
  ]),
  thumbnail: zod.array(zod.string()).min(1, { message: 'Thumbnail is required!' }),
  images: zod.array(zod.string()),
  tags: zod.array(zod.string()),
  key_features: zod.array(zod.string()),
});

export type ProductValidationSchemaType = zod.infer<typeof ProductValidationSchema>;

export function ManageProductForm() {
  const [selectedCategories, setSelectedCategories] = useState<string>('uncategorized');
  const categoryValue = useDebounce(selectedCategories, 5000);

  const { data: brands } = useGetBrandsQuery([
    { name: 'limit', value: 500 },
    { name: 'sortBy', value: 'name' },
    { name: 'sortOrder', value: 'asc' },
  ]);
  const { data: categories } = useGetCategoriesQuery([
    { name: 'limit', value: 500 },
    { name: 'sortBy', value: 'title' },
    { name: 'sortOrder', value: 'asc' },
  ]);
  const { data: attributes } = useGetAttributesQuery([
    { name: 'limit', value: 500 },
    { name: 'sortBy', value: 'name' },
    { name: 'sortOrder', value: 'asc' },
    { name: 'category', value: categoryValue },
  ]);

  const brandsOptions =
    brands?.data?.map((brand) => ({ label: brand.name, value: brand.id })) || [];
  const categoriesOptions =
    categories?.data?.map((category) => ({ label: category.title, value: category.id })) || [];

  const theme = useTheme();
  const defaultValues = useMemo(
    () => ({
      name: '',
      model: '',
      code: '',
      brand: null,
      category: [],
      price: 0,
      discount_price: 0,
      retailer_price: 0,
      stock: 0,
      video_url: '',
      thumbnail: [],
      images: [],
      tags: [],
      key_features: [],
    }),
    []
  );

  const methods = useForm<ProductValidationSchemaType>({
    mode: 'onSubmit',
    defaultValues,
    resolver: zodResolver(ProductValidationSchema),
  });

  const { handleSubmit, watch, reset } = methods;

  const watchCategory = watch('category');

  const onSubmit = handleSubmit(async (data) => {
    console.log('submitted data: ', data);
    const productInfo = productInfoFormatter(data);
    console.log(productInfo);
  });

  useEffect(() => {
    if (watchCategory?.length > 0) {
      const categoryQuery = watchCategory.map((item: TOptionItem) => item.label).join(',');
      setSelectedCategories(`uncategorized,${categoryQuery}`);
    } else {
      setSelectedCategories('uncategorized');
    }
  }, [watchCategory]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography sx={{ fontWeight: 'bold' }}>General information</Typography>
            <Typography variant="body2" color={theme.palette.text.secondary}>
              General information about the product
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Card sx={{ padding: 4, width: '100%', boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field.Text name="name" label="Name*" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field.Text name="model" label="Model*" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field.Text name="code" label="Code" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field.AutoComplete
                    name="category"
                    options={categoriesOptions}
                    label="Category"
                    multiple
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field.AutoComplete name="brand" options={brandsOptions} label="Brand" />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography sx={{ fontWeight: 'bold' }}>Price & stock information</Typography>
            <Typography variant="body2" color={theme.palette.text.secondary}>
              Price and avilable quantity of the product
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Card sx={{ padding: 4, width: '100%', boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field.Text
                    name="price"
                    label="Regular price"
                    placeholder="0.00"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box component="span" sx={{ color: 'text.disabled' }}>
                            $
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field.Text
                    name="discount_price"
                    label="Discount price"
                    placeholder="0.00"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box component="span" sx={{ color: 'text.disabled' }}>
                            $
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field.Text
                    name="retailer_price"
                    label="Retailer price"
                    placeholder="0.00"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box component="span" sx={{ color: 'text.disabled' }}>
                            $
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field.Text
                    name="stock"
                    label="Available stock"
                    placeholder="0"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography sx={{ fontWeight: 'bold' }}>Associated information</Typography>
            <Typography variant="body2" color={theme.palette.text.secondary}>
              Assign attributes related to the product
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Card sx={{ padding: 4, width: '100%', boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)' }}>
              {attributes?.data ? (
                <Grid container spacing={4}>
                  {attributes?.data.map((attribute) => {
                    const options = attribute.value.map((v) => ({ label: startCase(v), value: v }));
                    return (
                      <Grid item xs={12} md={6} key={attribute.id}>
                        <Stack direction="row" alignItems="center" gap={2}>
                          <Typography sx={{ width: '30%' }}>
                            {startCase(attribute.name)}:
                          </Typography>
                          <Field.AutoComplete
                            name={`attributes.${attribute.name}`}
                            options={options}
                            size="small"
                            placeholder="Select value"
                          />
                        </Stack>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Typography>No attributes found</Typography>
              )}
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography sx={{ fontWeight: 'bold' }}>Additional information</Typography>
            <Typography variant="body2" color={theme.palette.text.secondary}>
              Details information of the product
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Card sx={{ padding: 4, width: '100%', boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field.ChipText name="tags" label="Tags" />
                </Grid>
                <Grid item xs={12}>
                  <Field.ListText name="key_features" label="Key features" />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography sx={{ fontWeight: 'bold' }}>Media information</Typography>
            <Typography variant="body2" color={theme.palette.text.secondary}>
              Set images and video for the product
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Card sx={{ padding: 4, width: '100%', boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field.Text
                    name="video_url"
                    label="Video URL"
                    placeholder="https://www.example.com/video/4353"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field.ImageSelect
                    name="thumbnail"
                    modalTitle="Select thumbnail"
                    placeholderHeading="Select or upload thumbnail"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field.ImageSelect
                    name="images"
                    modalTitle="Select additional images"
                    placeholderHeading="Select or upload additional images"
                    placeholderSubHeading="Additional images are optional"
                    multipleImageHeader="Additional images"
                    multiple
                  />
                </Grid>
              </Grid>
            </Card>
            <Stack direction="row" justifyContent="flex-end" gap={1} width="100%" sx={{ mt: 4 }}>
              <Button variant="outlined" onClick={() => reset()}>
                Reset
              </Button>
              <LoadingButton type="submit" variant="contained" loading={false}>
                Add Product
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Form>
  );
}
