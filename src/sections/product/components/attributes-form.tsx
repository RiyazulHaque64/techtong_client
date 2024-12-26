import { startCase } from 'lodash';

import { Grid, Stack, Typography } from '@mui/material';

import { useGetAttributesQuery } from 'src/redux/features/attribute/attributeApi';

import { Field } from 'src/components/hook-form';

export function AttributesForm({ categoryValue }: { categoryValue: string }) {
  const { data: attributes } = useGetAttributesQuery([
    { name: 'limit', value: 500 },
    { name: 'sortBy', value: 'name' },
    { name: 'sortOrder', value: 'asc' },
    { name: 'category', value: categoryValue },
  ]);

  return (
    <>
      {attributes?.data ? (
        <Grid container spacing={4}>
          {attributes?.data.map((attribute) => {
            const options = attribute.value.map((v) => ({ label: startCase(v), value: v }));
            return (
              <Grid item xs={12} md={6} key={attribute.id}>
                <Stack direction="row" alignItems="center" gap={2}>
                  <Typography variant="subtitle2" sx={{ width: '30%' }}>
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
    </>
  );
}
