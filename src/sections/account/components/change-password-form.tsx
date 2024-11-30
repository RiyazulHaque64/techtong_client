import type { IErrorResponse } from 'src/redux/interfaces/common';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Alert, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useChangePasswordMutation } from 'src/redux/features/auth/authApi';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod
  .object({
    old_password: zod
      .string()
      .min(1, { message: 'Old password is required!' })
      .min(6, { message: 'Password must be at least 6 characters!' }),
    new_password: zod
      .string({ required_error: 'New password is required!' })
      .min(6, { message: 'Password must be at least 6 characters!' })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
        message: 'Password must contain at least one letter and one number!',
      }),
    confirm_password: zod
      .string({ required_error: 'Password is required!' })
      .min(6, { message: 'Password must be at least 6 characters!' }),
  })
  .superRefine((data, ctx) => {
    if (data.new_password !== data.confirm_password) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirm_password'],
        message: 'Passwords do not match!',
      });
    }
  });

// ----------------------------------------------------------------------

export function ChangePasswordForm() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const old_password = useBoolean();
  const new_password = useBoolean();
  const confirm_password = useBoolean();

  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const defaultValues = {
    old_password: '',
    new_password: '',
    confirm_password: '',
  };

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      const res = await changePassword({
        old_password: data.old_password,
        new_password: data.new_password,
      });
      if (res?.error) {
        setErrorMsg((res?.error as IErrorResponse)?.data?.message);
      } else {
        reset();
        toast.success('Password changed successfully!');
        navigate(paths.dashboard.root, { replace: true });
      }
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : err.message);
    }
  });

  return (
    <Stack direction="column" alignItems="center">
      <Card
        sx={{
          p: 6,
          width: {
            xs: '95%',
            sm: '75%',
            md: '60%',
            xl: '50%',
          },
        }}
      >
        {!!errorMsg && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMsg}
          </Alert>
        )}
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Old Password</Typography>
              <Field.Text
                name="old_password"
                placeholder="Old Password"
                type={old_password.value ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={old_password.onToggle} edge="end">
                        <Iconify
                          icon={old_password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">New Password</Typography>
              <Field.Text
                name="new_password"
                placeholder="New Password"
                type={new_password.value ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={new_password.onToggle} edge="end">
                        <Iconify
                          icon={new_password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Field.Text
                name="confirm_password"
                placeholder="Confirm Password"
                type={confirm_password.value ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={confirm_password.onToggle} edge="end">
                        <Iconify
                          icon={confirm_password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting || isLoading}>
                Update
              </LoadingButton>
            </Stack>
          </Stack>
        </Form>
      </Card>
    </Stack>
  );
}
