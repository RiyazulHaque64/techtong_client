import { Grid, Typography } from '@mui/material';

import { Field } from 'src/components/hook-form';

export function DetailsInformationForm() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Field.ChipText name="tags" label="Tags" />
      </Grid>
      <Grid item xs={12}>
        <Field.ListText name="key_features" label="Key features" />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Description:
        </Typography>
        <Field.Editor
          name="description"
          sx={{ maxHeight: 480 }}
          placeholder="Write details about the product"
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Additional Information:
        </Typography>
        <Field.Editor
          name="additional_information"
          sx={{ maxHeight: 480 }}
          placeholder="Write additional innformation of the product"
        />
      </Grid>
    </Grid>
  );
}
