import type { ReactNode } from 'react';

import { Card, Grid, Typography } from '@mui/material';

type Props = { sectionInfo: { title: string; description: string; content: ReactNode } };

export default function ProductFormSection({ sectionInfo }: Props) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <Typography sx={{ fontWeight: 'bold' }}>{sectionInfo.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {sectionInfo.description}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={8}>
        <Card sx={{ padding: 4, width: '100%', boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)' }}>
          {sectionInfo.content}
        </Card>
      </Grid>
    </Grid>
  );
}
