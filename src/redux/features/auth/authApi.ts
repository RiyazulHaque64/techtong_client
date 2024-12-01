import { baseApi } from 'src/redux/api/baseApi';
import api_endpoint from 'src/redux/api/apiEndpoint';

import { setUser } from './authSlice';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: api_endpoint.auth.login,
        method: 'POST',
        body: userInfo,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data: responseData } = await queryFulfilled;
          const {
            data: { access_token, ...remainingData },
          } = responseData;
          dispatch(setUser({ token: access_token, user: remainingData }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: api_endpoint.auth.forgot_password,
        method: 'POST',
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: api_endpoint.auth.change_password,
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data: responseData } = await queryFulfilled;
          const {
            data: { access_token, ...remainingData },
          } = responseData;
          dispatch(setUser({ token: access_token, user: remainingData }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateProfile: builder.mutation({
      query: (data: FormData) => ({
        url: api_endpoint.user.update_profile,
        method: 'PATCH',
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data: responseData } = await queryFulfilled;

          dispatch(setUser({ token: 'prev', user: responseData.data }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
} = authApi;
