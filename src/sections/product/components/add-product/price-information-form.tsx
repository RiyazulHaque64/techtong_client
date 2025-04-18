import type { SxProps } from '@mui/material';

import { Grid, InputAdornment } from '@mui/material';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

export function PriceInformationForm({ sx }: { sx?: SxProps }) {
  return (
    <Grid container spacing={2} sx={{ ...sx }}>
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
                <Iconify icon="tabler:currency-taka" />
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
                <Iconify icon="tabler:currency-taka" />
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
                <Iconify icon="tabler:currency-taka" />
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
  );
}
