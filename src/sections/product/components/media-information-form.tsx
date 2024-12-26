import { Grid } from '@mui/material';

import { Field } from 'src/components/hook-form';

export default function MediaInformationForm() {
  return (
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
  );
}
