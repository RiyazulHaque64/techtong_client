import type { IErrorResponse } from 'src/redux/interfaces/common';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { Link, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useForgotPasswordMutation } from 'src/redux/features/auth/authApi';

import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../components/form-head';

// ----------------------------------------------------------------------

export type ForgotPasswordSchemaType = zod.infer<typeof ForgotPasswordSchema>;

export const ForgotPasswordSchema = zod.object({
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
});

// ----------------------------------------------------------------------

export function ForgotPasswordView() {
  const [forgotPassword] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState('');

  const defaultValues = {
    email_or_contact_number: '',
  };

  const methods = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    try {
      setErrorMsg('');
      const res = await forgotPassword(data);
      if (res?.data?.success) {
        navigate(paths.auth.login, { state: { message: res?.data?.message } });
      }
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

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Getting..."
      >
        Get Password
      </LoadingButton>
      <Box gap={1.5} display="flex" flexDirection="column">
        <Typography variant="body2" color="inherit" sx={{ alignSelf: 'flex-end' }}>
          Back to{' '}
          <Link component={RouterLink} href={paths.auth.login}>
            login
          </Link>
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <FormHead title="Get a new password" sx={{ textAlign: { xs: 'center', md: 'left' } }} />

      <Alert severity="info" sx={{ mb: 3 }}>
        Use your <strong>email</strong> or <strong>contact number</strong> to get a new password
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
