import type { IBrand } from 'src/types/brand';
import type { TMeta, TQueryParam, TReduxResponse } from 'src/redux/interfaces/common';

import { baseApi } from 'src/redux/api/baseApi';
import api_endpoint from 'src/redux/api/apiEndpoint';
import { tags } from 'src/redux/constants/tag-types';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addBrand: builder.mutation({
      query: (data) => ({
        url: api_endpoint.brand.add_brand,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [tags.brand],
    }),
    getBrands: builder.query({
      query: (args: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args.length) {
          args.forEach((item) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: api_endpoint.brand.get_brands,
          method: 'GET',
          params,
        };
      },
      providesTags: [tags.brand],
      transformResponse: (response: TReduxResponse<IBrand[]>) => ({
        data: response.data,
        meta: response.meta as TMeta,
      }),
    }),
    deleteBrand: builder.mutation({
      query: (id: string) => ({
        url: `${api_endpoint.brand.delete_brand}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tags.brand],
    }),
    updateBrand: builder.mutation({
      query: (paylaod: { data: Record<string, string>; id: string }) => ({
        url: `${api_endpoint.brand.update_brand}/${paylaod.id}`,
        method: 'PATCH',
        body: paylaod.data,
      }),
      invalidatesTags: [tags.brand],
    }),
  }),
});

export const {
  useAddBrandMutation,
  useGetBrandsQuery,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = authApi;
