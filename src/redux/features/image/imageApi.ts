import type { IImage } from 'src/types/image';
import type { TMeta, TQueryParam, TReduxResponse } from 'src/redux/interfaces/common';

import { baseApi } from 'src/redux/api/baseApi';
import api_endpoint from 'src/redux/api/apiEndpoint';
import { tags } from 'src/redux/constants/tag-types';

const imageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImages: builder.mutation({
      query: (data: FormData) => ({
        url: api_endpoint.image.upload_images,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [tags.image],
    }),
    getImages: builder.query({
      query: (args: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args.length) {
          args.forEach((item) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: api_endpoint.image.get_images,
          method: 'GET',
          params,
        };
      },
      providesTags: [tags.image],
      transformResponse: (response: TReduxResponse<IImage[]>) => ({
        data: response.data,
        meta: response.meta as TMeta,
      }),
    }),
    deleteImages: builder.mutation({
      query: (data: { images_path: string[] }) => ({
        url: api_endpoint.image.delete_image,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: [tags.image],
    }),
    updateImage: builder.mutation({
      query: (paylaod: { data: Record<string, string>; id: string }) => ({
        url: `${api_endpoint.image.update_image}/${paylaod.id}`,
        method: 'PATCH',
        body: paylaod.data,
      }),
      invalidatesTags: [tags.image],
    }),
  }),
});

export const {
  useUploadImagesMutation,
  useGetImagesQuery,
  useDeleteImagesMutation,
  useUpdateImageMutation,
} = imageApi;
