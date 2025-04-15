import type { TMeta, TQueryParam, TReduxResponse } from 'src/redux/interfaces/common';
import type { IOrder } from 'src/types/order';

import api_endpoint from 'src/redux/api/api-endpoints';
import { baseApi } from 'src/redux/api/base-api';
import { tags } from 'src/redux/constants/tag-types';

const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query({
            query: (args: TQueryParam[]) => {
                const params = new URLSearchParams();
                if (args.length) {
                    args.forEach((item) => {
                        params.append(item.name, item.value as string);
                    });
                }
                return {
                    url: api_endpoint.order.get_orders,
                    method: 'GET',
                    params,
                };
            },
            providesTags: [tags.order],
            transformResponse: (response: TReduxResponse<IOrder[]>) => ({
                data: response.data,
                meta: response.meta as TMeta & {
                    [key: string]: number
                },
            }),
        }),
        getSingleOrder: builder.query({
            query: (order_id: string) => ({
                url: `${api_endpoint.order.get_single_order}/${order_id}`,
                method: 'GET',
            }),
            providesTags: [tags.order],
        }),
        updateOrder: builder.mutation({
            query: (paylaod: { id: string; data: Record<string, any> }) => ({
                url: `${api_endpoint.order.update_order}/${paylaod.id}`,
                method: 'PATCH',
                body: paylaod.data,
            }),
            invalidatesTags: [tags.order],
        }),
        deleteOrders: builder.mutation({
            query: (payload: { ids: string[] }) => ({
                url: `${api_endpoint.order.delete_orders}`,
                method: 'DELETE',
                body: payload,
            }),
            invalidatesTags: [tags.order],
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useUpdateOrderMutation,
    useDeleteOrdersMutation,
    useGetSingleOrderQuery
} = orderApi;
