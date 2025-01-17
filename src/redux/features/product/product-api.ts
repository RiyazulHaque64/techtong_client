import type { IProduct } from 'src/types/product';
import type { TMeta, TQueryParam, TReduxResponse } from 'src/redux/interfaces/common';

import { baseApi } from 'src/redux/api/base-api';
import { tags } from 'src/redux/constants/tag-types';
import api_endpoint from 'src/redux/api/api-endpoints';

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (data) => ({
        url: api_endpoint.product.add_product,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [tags.product],
    }),
    getProducts: builder.query({
      query: (args: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args.length) {
          args.forEach((item) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: api_endpoint.product.get_products,
          method: 'GET',
          params,
        };
      },
      providesTags: [tags.product],
      transformResponse: (response: TReduxResponse<IProduct[]>) => ({
        data: response.data,
        meta: response.meta as TMeta,
      }),
    }),
    getSingleProduct: builder.query({
      query: (slug: string) => ({
        url: `${api_endpoint.product.get_single_product}/${slug}`,
        method: 'GET',
      }),
      providesTags: [tags.product],
    }),
    deleteProducts: builder.mutation({
      query: (payload: { ids: string[] }) => ({
        url: `${api_endpoint.product.delete_products}`,
        method: 'DELETE',
        body: payload,
      }),
      invalidatesTags: [tags.product],
    }),
    updateProduct: builder.mutation({
      query: (paylaod: { id: string; data: Record<string, any> }) => ({
        url: `${api_endpoint.product.update_product}/${paylaod.id}`,
        method: 'PATCH',
        body: paylaod.data,
      }),
      invalidatesTags: [tags.product],
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetProductsQuery,
  useGetSingleProductQuery,
  useDeleteProductsMutation,
  useUpdateProductMutation,
} = productApi;
