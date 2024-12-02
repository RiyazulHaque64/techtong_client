import type { TQueryParam } from 'src/types/common';

import { baseApi } from 'src/redux/api/baseApi';
import api_endpoint from 'src/redux/api/apiEndpoint';
import { tags } from 'src/redux/constants/tag-types';

const authApi = baseApi.injectEndpoints({
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
    }),
  }),
});

export const { useUploadImagesMutation, useGetImagesQuery } = authApi;
