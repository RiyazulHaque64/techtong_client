import type { Dayjs } from 'dayjs';

export type IDateValue = string | number | null;

export type IDatePickerControl = Dayjs | null;

export type TQueryParam = {
  name: string;
  value: string | number;
};
