import type { Control } from 'react-hook-form';

import { useFieldArray } from 'react-hook-form';

import { Stack, Button } from '@mui/material';

import SpecificationSection from './specification-section';

import type { ProductValidationSchemaType } from '../manage-product-form';

export default function SpecificationForm({
  control,
}: {
  control: Control<ProductValidationSchemaType>;
}) {
  const {
    fields: specificationFields,
    append: appendSection,
    insert: insertSection,
    remove: removeSection,
  } = useFieldArray({
    control,
    name: 'specification',
  });

  return (
    <Stack direction="column" spacing={2}>
      {specificationFields.length === 0 && (
        <Button
          variant="outlined"
          title="Add Section"
          onClick={() => appendSection({ heading: '', fields: [{ title: '', value: '' }] })}
        >
          Add Section
        </Button>
      )}
      {specificationFields.map((section, sectionIndex: number) => (
        <SpecificationSection
          key={section.id}
          control={control}
          sectionIndex={sectionIndex}
          sectionLength={specificationFields.length}
          insertSection={insertSection}
          removeSection={removeSection}
        />
      ))}
    </Stack>
  );
}
