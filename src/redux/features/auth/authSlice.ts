import type { RootState } from 'src/redux/store';

import { createSlice } from '@reduxjs/toolkit';

export type TUser = {
  id: string;
  name: string;
  email: string;
  contact_number: string;
  profile_pic?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'RETAILER' | 'USER';
};

type TAuthState = {
  user: TUser | null;
  token: null | string;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token === 'prev' ? state.token : token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
