import type { Control } from 'react-hook-form';

import { Fragment } from 'react';
import { useFieldArray } from 'react-hook-form';

import { Grid, Stack, Button, IconButton } from '@mui/material';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

export type TSection = { heading: string; fields: [{ title: string; value: string }] };

export default function SpecificationSection({
  control,
  sectionIndex,
  sectionLength,
  insertSection,
  removeSection,
}: {
  control: Control<any>;
  sectionIndex: number;
  sectionLength: number;
  insertSection: (index: number, section: TSection) => void;
  removeSection: (index: number) => void;
}) {
  const {
    fields: sectionFields,
    remove: fieldRemove,
    insert: fieldInsert,
    append: fieldAppend,
  } = useFieldArray({
    control,
    name: `specification.${sectionIndex}.fields`,
  });

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Field.Text name={`specification.${sectionIndex}.heading`} label="Heading*" />
        </Grid>
        {sectionFields.map((field, fieldIndex) => (
          <Fragment key={field.id}>
            <Grid item xs={12} md={5}>
              <Field.Text
                name={`specification.${sectionIndex}.fields.${fieldIndex}.title`}
                label="Title*"
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <Field.Text
                name={`specification.${sectionIndex}.fields.${fieldIndex}.value`}
                label="Value*"
              />
            </Grid>
            <Grid item xs={2} md={2}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                gap={1}
                sx={{ height: '100%' }}
              >
                <IconButton
                  sx={{ border: '1px solid', borderColor: 'divider' }}
                  onClick={() => fieldRemove(fieldIndex)}
                  title="Remove Field"
                >
                  <Iconify icon="eva:minus-fill" />
                </IconButton>
                <IconButton
                  sx={{ border: '1px solid', borderColor: 'divider' }}
                  onClick={() => fieldInsert(fieldIndex + 1, { title: '', value: '' })}
                  title="Add Field"
                >
                  <Iconify icon="eva:plus-fill" />
                </IconButton>
              </Stack>
            </Grid>
          </Fragment>
        ))}
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="flex-start" gap={1} sx={{ height: '100%' }}>
          <Button
            variant="outlined"
            title="Add Section"
            onClick={() => removeSection(sectionIndex)}
          >
            Remove Section
          </Button>
          <Button
            variant="outlined"
            title="Add Section"
            onClick={() =>
              insertSection(sectionIndex + 1, { heading: '', fields: [{ title: '', value: '' }] })
            }
          >
            Add Section
          </Button>
          {sectionFields.length === 0 && (
            <Button
              sx={{ border: '1px solid', borderColor: 'divider' }}
              onClick={() => fieldAppend({ title: '', value: '' })}
              title="Add Field"
            >
              Add Field
            </Button>
          )}
        </Stack>
      </Grid>
    </>
  );
}
