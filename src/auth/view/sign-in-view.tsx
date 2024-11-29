import type { IErrorResponse } from 'src/redux/interfaces/common';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useLoginMutation } from 'src/redux/features/auth/authApi';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../components/form-head';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  email_or_contact_number: zod
    .string({
      required_error: 'Email or contact number is required',
    })
    .refine(
      (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const bangladeshiPhoneRegex = /^01\d{9}$/;
        return emailRegex.test(value) || bangladeshiPhoneRegex.test(value);
      },
      {
        message: 'Invalid email or contact number',
      }
    ),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function SignInView() {
  const [login] = useLoginMutation();
  const location = useLocation();

  const stateMessage = location?.state?.message;

  console.log('location state: ', location.state);

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const defaultValues = {
    email_or_contact_number: 'riyazulhaque64@gmail.com',
    password: 'DfzyER',
  };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      const res = await login(data);
      //   await checkUserSession?.();

      //   router.refresh();
      if (res?.error) {
        setErrorMsg((res?.error as IErrorResponse)?.data?.message);
      }
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : err.message);
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text
        name="email_or_contact_number"
        label="Email/Contact Number"
        placeholder="user@example.com / 01500000000"
        InputLabelProps={{ shrink: true }}
      />

      <Box gap={1.5} display="flex" flexDirection="column">
        <Link
          component={RouterLink}
          href={paths.auth.forgot_password}
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          Forgot password?
        </Link>

        <Field.Text
          name="password"
          label="Password"
          placeholder="password"
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sign in..."
      >
        Login
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead title="Login to your account" sx={{ textAlign: { xs: 'center', md: 'left' } }} />

      <Alert severity="info" sx={{ mb: 3 }}>
        {stateMessage || (
          <>
            Use your <strong>email</strong> or <strong>contact number</strong> to login your account
          </>
        )}
      </Alert>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
