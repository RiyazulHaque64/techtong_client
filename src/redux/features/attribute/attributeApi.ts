import type { IAttribute } from 'src/types/attribute';
import type { TMeta, TQueryParam, TReduxResponse } from 'src/redux/interfaces/common';

import { baseApi } from 'src/redux/api/base-api';
import { tags } from 'src/redux/constants/tag-types';
import api_endpoint from 'src/redux/api/api-endpoints';

const attributeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addAttribute: builder.mutation({
      query: (data) => ({
        url: api_endpoint.attribute.add_attribute,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [tags.attribute],
    }),
    getAttributes: builder.query({
      query: (args: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args.length) {
          args.forEach((item) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: api_endpoint.attribute.get_attributes,
          method: 'GET',
          params,
        };
      },
      providesTags: [tags.attribute],
      transformResponse: (response: TReduxResponse<IAttribute[]>) => ({
        data: response.data,
        meta: response.meta as TMeta,
      }),
    }),
    deleteAttribute: builder.mutation({
      query: (payload: { ids: string[] }) => ({
        url: `${api_endpoint.attribute.delete_attributes}`,
        method: 'DELETE',
        body: payload,
      }),
      invalidatesTags: [tags.attribute],
    }),
    updateAttribute: builder.mutation({
      query: (paylaod: { id: string; data: Record<string, any> }) => ({
        url: `${api_endpoint.attribute.update_attribute}/${paylaod.id}`,
        method: 'PATCH',
        body: paylaod.data,
      }),
      invalidatesTags: [tags.attribute],
    }),
  }),
});

export const {
  useAddAttributeMutation,
  useGetAttributesQuery,
  useDeleteAttributeMutation,
  useUpdateAttributeMutation,
} = attributeApi;
