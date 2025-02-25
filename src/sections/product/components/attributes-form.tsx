import type { IAttribute } from 'src/types/attribute';

import { Grid, Stack, Typography } from '@mui/material';

import { capitalizeEachWord } from 'src/utils/change-case';

import { Field } from 'src/components/hook-form';

export function AttributesForm({ attributes }: { attributes: IAttribute[] | undefined }) {
  return (
    <>
      {attributes ? (
        <Grid container spacing={4}>
          {attributes.map((attribute) => {
            const options = attribute.value.map((v) => ({
              label: capitalizeEachWord(v),
              value: v,
            }));
            return (
              <Grid item xs={12} md={6} key={attribute.id}>
                <Stack direction="row" alignItems="center" gap={2}>
                  <Typography
                    variant="subtitle2"
                    sx={{ width: '30%', textTransform: 'capitalize' }}
                  >
                    {attribute.name}:
                  </Typography>
                  <Field.AutoComplete
                    name={`attributes.${attribute.name}`}
                    options={options}
                    size="small"
                    placeholder="Select value"
                    multiple
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
