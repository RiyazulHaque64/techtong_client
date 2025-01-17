import type { TProductSpecificationItem } from 'src/types/product';

import { Fragment } from 'react';

import { Box, Table, Paper, TableRow, TableBody, TableCell, TableContainer } from '@mui/material';

import { EmptyContent } from 'src/components/empty-content';

type Props = {
  specifications: TProductSpecificationItem[];
};
const ProductSpecification = ({ specifications }: Props) => {
  if (!specifications || specifications.length === 0)
    return <EmptyContent title="No specification found" sx={{ pt: 6, pb: 10 }} />;
  return (
    <Box sx={{ m: 5 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {specifications.map((spec: TProductSpecificationItem) => (
              <Fragment key={spec.heading}>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    align="center"
                    sx={{
                      backgroundColor: (theme) => theme.palette.grey[300],
                      color: 'text.primary',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      textAlign: 'center',
                      padding: 1.2,
                    }}
                  >
                    {spec.heading}
                  </TableCell>
                </TableRow>
                {spec.fields.map((field, index) => (
                  <TableRow key={index}>
                    <TableCell
                      sx={{
                        width: '25%',
                        backgroundColor: (theme) => theme.palette.grey[100],
                        color: 'text.primary',
                        fontWeight: 'bold',
                        padding: 1.2,
                      }}
                    >
                      {field.title}
                    </TableCell>
                    <TableCell
                      sx={{
                        width: '75%',
                        backgroundColor: '#fff',
                        color: '#000',
                        padding: '10px',
                      }}
                    >
                      {field.value}
                    </TableCell>
                  </TableRow>
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductSpecification;
