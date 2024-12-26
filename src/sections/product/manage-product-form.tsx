import type { TOptionItem } from 'src/components/hook-form/rhf-auto-complete';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import { Stack, Button } from '@mui/material';

import { useDebounce } from 'src/hooks/use-debounce';

import { Form } from 'src/components/hook-form';

import { productInfoFormatter } from './utils';
import { AttributesForm } from './components/attributes-form';
import SpecificationForm from './components/specification-form';
import ProductFormSection from './components/product-form-section';
import MediaInformationForm from './components/media-information-form';
import { PriceInformationForm } from './components/price-information-form';
import GeneralInformationForm from './components/general-information-form';
import { DetailsInformationForm } from './components/details-information-form';

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

export function ManageProductForm() {
  const [selectedCategories, setSelectedCategories] = useState<string>('uncategorized');
  const categoryValue = useDebounce(selectedCategories, 5000);

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
      description: '',
      additional_information: '',
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

  const { handleSubmit, watch, reset, control } = methods;

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
      content: <AttributesForm categoryValue={categoryValue} />,
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
      <Stack spacing={3}>
        {formSections.map((section) => (
          <ProductFormSection key={section.title} sectionInfo={section} />
        ))}
        <Stack direction="row" justifyContent="flex-end" gap={1} width="100%" sx={{ mt: 4 }}>
          <Button variant="outlined" onClick={() => reset()}>
            Reset
          </Button>
          <LoadingButton type="submit" variant="contained" loading={false}>
            Add Product
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
