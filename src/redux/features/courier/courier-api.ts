import type { TMeta, TQueryParam, TReduxResponse } from 'src/redux/interfaces/common';
import type { ICourier, TAddCourier } from 'src/types/courier';

import api_endpoint from 'src/redux/api/api-endpoints';
import { baseApi } from 'src/redux/api/base-api';
import { tags } from 'src/redux/constants/tag-types';

const courierApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addCourier: builder.mutation({
            query: (data: TAddCourier) => ({
                url: api_endpoint.courier.add_courier,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [tags.courier],
        }),
        getCouriers: builder.query({
            query: (args: TQueryParam[]) => {
                const params = new URLSearchParams();
                if (args.length) {
                    args.forEach((item) => {
                        params.append(item.name, item.value as string);
                    });
                }
                return {
                    url: api_endpoint.courier.get_couriers,
                    method: 'GET',
                    params,
                };
            },
            providesTags: [tags.courier],
            transformResponse: (response: TReduxResponse<ICourier[]>) => ({
                data: response.data,
                meta: response.meta as TMeta & {
                    [key: string]: number
                },
            }),
        }),
        updateCourier: builder.mutation({
            query: (paylaod: { id: string; data: Record<string, any> }) => ({
                url: `${api_endpoint.courier.update_courier}/${paylaod.id}`,
                method: 'PATCH',
                body: paylaod.data,
            }),
            invalidatesTags: [tags.courier],
        }),
        deleteCouriers: builder.mutation({
            query: (payload: { ids: string[] }) => ({
                url: `${api_endpoint.courier.delete_couriers}`,
                method: 'DELETE',
                body: payload,
            }),
            invalidatesTags: [tags.courier],
        }),
    }),
});

export const {
    useAddCourierMutation,
    useGetCouriersQuery,
    useUpdateCourierMutation,
    useDeleteCouriersMutation
} = courierApi;
