import type { IProduct } from 'src/types/product';
import type { IErrorResponse } from 'src/redux/interfaces/common';
import type { TOptionItem } from 'src/components/hook-form/rhf-auto-complete';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { LoadingButton } from '@mui/lab';
import { Alert, Stack, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useDebounce } from 'src/hooks/use-debounce';

import { useGetAttributesQuery } from 'src/redux/features/attribute/attributeApi';
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from 'src/redux/features/product/product-api';

import { Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { AttributesForm } from './attributes-form';
import SpecificationForm from './specification-form';
import ProductFormSection from './product-form-section';
import MediaInformationForm from './media-information-form';
import GeneralInformationForm from './general-information-form';
import { PriceInformationForm } from './price-information-form';
import { DetailsInformationForm } from './details-information-form';
import { resetProductForm, productInfoFormatter } from '../../utils';

export const ProductValidationSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  model: zod.string().min(1, { message: 'Model is required!' }),
  code: zod.string().optional(),
  warranty: zod.string().optional(),
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
  description: zod.string(),
  additional_information: zod.string(),
  specification: zod.array(
    zod.object({
      heading: zod.string(),
      fields: zod.array(zod.object({ title: zod.string(), value: zod.string() })),
    })
  ),
});

export type ProductValidationSchemaType = zod.infer<typeof ProductValidationSchema>;

type Props = {
  product?: IProduct;
};

export function ManageProductForm({ product }: Props) {
  const navigate = useNavigate();

  const [selectedCategories, setSelectedCategories] = useState<string>('uncategorized');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const [addProduct, { isLoading: addProductLoading }] = useAddProductMutation();
  const [updateProduct, { isLoading: updateProductLoading }] = useUpdateProductMutation();

  const categoryValue = useDebounce(selectedCategories, 5000);

  const { data: attributes } = useGetAttributesQuery([
    { name: 'limit', value: 500 },
    { name: 'sortBy', value: 'name' },
    { name: 'sortOrder', value: 'asc' },
    { name: 'category', value: categoryValue },
  ]);

  const defaultValues = useMemo(
    () => ({
      name: '',
      model: '',
      code: '',
      warranty: '',
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
      description: '',
      additional_information: '',
      attributes: {
        Availability: [{ label: 'In Stock', value: 'in stock' }],
      },
      specification: [
        {
          heading: '',
          fields: [{ title: '', value: '' }],
        },
      ],
    }),
    []
  );

  const methods = useForm<ProductValidationSchemaType>({
    mode: 'onSubmit',
    defaultValues,
    resolver: zodResolver(ProductValidationSchema),
  });

  const { handleSubmit, watch, reset, control, setValue } = methods;

  const watchCategory = watch('category');

  const onSubmit = handleSubmit(async (data) => {
    console.log('data: ', data);
    try {
      setErrorMsg('');
      const formattedData = productInfoFormatter(data);

      let res;
      if (!product) {
        res = await addProduct(formattedData);
      } else {
        res = await updateProduct({ id: product.id, data: formattedData });
      }
      if (res?.error) {
        toast.error(product ? 'Update failed!' : 'Add failed!');
        setStatusCode((res?.error as IErrorResponse)?.status);
        setErrorMsg((res?.error as IErrorResponse)?.data?.message);
      } else {
        toast.success(product ? 'Update success!' : 'Add success!');
        if (!product) {
          reset();
        } else {
          navigate(paths.dashboard.product);
        }
      }
    } catch (error) {
      toast.error('Add failed!');
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  useEffect(() => {
    if (watchCategory?.length > 0) {
      const categoryQuery = watchCategory.map((item: TOptionItem) => item.label).join(',');
      setSelectedCategories(`uncategorized,${categoryQuery}`);
    } else {
      setSelectedCategories('uncategorized');
    }
  }, [watchCategory]);

  const resetValue = useCallback(() => {
    if (product) {
      resetProductForm(product, setValue);
    }
  }, [product, setValue]);

  useEffect(() => {
    resetValue();
  }, [resetValue]);

  const formSections = [
    {
      title: 'General information',
      description: 'General information about the product',
      content: <GeneralInformationForm />,
    },
    {
      title: 'Price & stock information',
      description: 'Price and avilable quantity of the product',
      content: <PriceInformationForm />,
    },
    {
      title: 'Specification',
      description: 'Specification of the product',
      content: <SpecificationForm control={control} />,
    },
    {
      title: 'Associated information',
      description: 'Assign attributes related to the product',
      content: <AttributesForm attributes={attributes?.data} />,
    },
    {
      title: 'Additional information',
      description: 'Details information of the product',
      content: <DetailsInformationForm />,
    },
    {
      title: 'Media information',
      description: 'Set images and video for the product',
      content: <MediaInformationForm />,
    },
  ];

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Alert
        variant="outlined"
        severity={errorMsg ? 'error' : 'info'}
        sx={{ mb: 3 }}
        action={
          errorMsg &&
          statusCode === 409 && (
            <Button
              color="error"
              size="small"
              variant="soft"
              startIcon={<Iconify icon="eva:trash-2-fill" />}
            >
              Trash
            </Button>
          )
        }
      >
        {errorMsg || 'Product name, model and price is required to add a product.'}
      </Alert>
      <Stack spacing={3}>
        {formSections.map((section) => (
          <ProductFormSection key={section.title} sectionInfo={section} />
        ))}
        <Stack direction="row" justifyContent="flex-end" gap={1} width="100%" sx={{ mt: 4 }}>
          {!product && (
            <Button variant="outlined" disabled={addProductLoading} onClick={() => reset()}>
              Reset
            </Button>
          )}
          <LoadingButton
            type="submit"
            variant="contained"
            disabled={addProductLoading || updateProductLoading}
            loading={addProductLoading || updateProductLoading}
          >
            {product ? 'Save changes' : 'Add product'}
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
