import type {
  FetchArgs,
  BaseQueryFn,
  BaseQueryApi,
  DefinitionType,
} from '@reduxjs/toolkit/query/react';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { CONFIG } from 'src/config-global';

import { tagTypes } from '../constants/tag-types';
import { logout, setUser } from '../features/auth/authSlice';

import type { RootState } from '../store';
import type { IErrorResponse } from '../interfaces/common';

const baseQuery = fetchBaseQuery({
  baseUrl: `${CONFIG.serverUrl}/api/v1/`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const { token } = (getState() as RootState).auth;
    if (token) {
      headers.set('authorization', token as unknown as string);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<FetchArgs, BaseQueryApi, DefinitionType> = async (
  args,
  api,
  extraOptions
): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 404) {
    // show error
  }
  if (result?.error?.status === 401) {
    const res = await fetch(`${CONFIG.serverUrl}/api/v1/auth/access-token`, {
      method: 'POST',
      credentials: 'include',
    });
    const data = await res.json();
    if (data?.data) {
      const { user } = (api.getState() as RootState).auth;
      api.dispatch(setUser({ user, token: data.data }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRefreshToken as typeof baseQueryWithRefreshToken & {
    errorType: IErrorResponse;
  },
  endpoints: () => ({}),
  tagTypes,
});
