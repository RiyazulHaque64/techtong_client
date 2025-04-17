import type { IOrder } from 'src/types/order';

import JsPDF from 'jspdf';
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

import { Button } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import OrderInvoice from 'src/components/invoice/order-invoice';

type Props = {
  order: IOrder;
};

const OrderPrintButton = ({ order }: Props) => {
  console.log('order: ', order);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (invoiceRef.current) {
      const canvas = await html2canvas(invoiceRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new JsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = 210;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl);
    }
  };

  return (
    <>
      <style>
        {`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
            }
            .invoice {
              padding: 0 !important;
              margin: 0 !important;
              box-shadow: none !important;
            }
            .no-print {
              display: none !important;
            }
          }

          @page {
            size: A4;
            margin: 0;
          }
        `}
      </style>
      <Button
        color="inherit"
        variant="outlined"
        startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
        onClick={handleDownload}
      >
        Print
      </Button>
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <OrderInvoice ref={invoiceRef} order={order} />
      </div>
    </>
  );
};

export default OrderPrintButton;

//   const handleDownload = async () => {
//     window.print();
//     // if (invoiceRef.current) {
//     //   const canvas = await html2canvas(invoiceRef.current);
//     //   const imgData = canvas.toDataURL('image/png');
//     //   const pdf = new JsPDF('p', 'mm', 'a4');
//     //   const imgProps = pdf.getImageProperties(imgData);
//     //   const pdfWidth = 210;
//     //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     //   pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//     //   pdf.save(`invoice-${'ORD'}.pdf`);
//     // }
//   };
