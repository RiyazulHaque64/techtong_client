import type { Dayjs } from 'dayjs';

export type IDateValue = string | number | null;

export type IDatePickerControl = Dayjs | null;

export type IAddressItem = {
  id?: string;
  name: string;
  company?: string;
  primary?: boolean;
  fullAddress: string;
  phoneNumber?: string;
  addressType?: string;
};

export type TFilterOption = { value: string; label: string };
