import type { BaseQueryApi } from '@reduxjs/toolkit/query';

export type TErrorData = {
  success: boolean;
  message: string;
  errorSources: { path: string; message: string }[];
};

export interface IErrorResponse {
  status: number;
  data: TErrorData;
}

export type TQueryParam = {
  name: string;
  value: string | number;
};

export type TMeta = {
  page: number;
  limit: number;
  total: number;
};

export type TResponse<T> = {
  success: boolean;
  message: string;
  meta?: TMeta;
  data: T;
};

export type TReduxResponse<T> = TResponse<T> & BaseQueryApi;
