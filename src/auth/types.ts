import type { TUser } from 'src/redux/features/auth/authSlice';

export type UserType = TUser | null;

export type AuthState = {
  user: UserType;
};

export type AuthContextValue = {
  user: UserType;
  authenticated: boolean;
  unauthenticated: boolean;
};
