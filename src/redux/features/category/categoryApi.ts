import type { ICategory } from 'src/types/category';
import type { TMeta, TQueryParam, TReduxResponse } from 'src/redux/interfaces/common';

import { baseApi } from 'src/redux/api/baseApi';
import api_endpoint from 'src/redux/api/apiEndpoint';
import { tags } from 'src/redux/constants/tag-types';

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (data) => ({
        url: api_endpoint.category.add_category,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [tags.category],
    }),
    getCategories: builder.query({
      query: (args: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args.length) {
          args.forEach((item) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: api_endpoint.category.get_categories,
          method: 'GET',
          params,
        };
      },
      providesTags: [tags.category],
      transformResponse: (response: TReduxResponse<ICategory[]>) => ({
        data: response.data,
        meta: response.meta as TMeta,
      }),
    }),
    deleteCategories: builder.mutation({
      query: (payload: { ids: string[] }) => ({
        url: `${api_endpoint.category.delete_category}`,
        method: 'DELETE',
        body: payload,
      }),
      invalidatesTags: [tags.category],
    }),
    updateCategory: builder.mutation({
      query: (paylaod: { id: string; data: Record<string, string> }) => ({
        url: `${api_endpoint.category.update_category}/${paylaod.id}`,
        method: 'PATCH',
        body: paylaod.data,
      }),
      invalidatesTags: [tags.category],
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useGetCategoriesQuery,
  useDeleteCategoriesMutation,
  useUpdateCategoryMutation,
} = categoryApi;
