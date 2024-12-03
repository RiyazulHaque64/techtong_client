import type { IErrorResponse } from 'src/redux/interfaces/common';

import { z as zod } from 'zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Alert } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { fData } from 'src/utils/format-number';

import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentUser } from 'src/redux/features/auth/authSlice';
import { useUpdateProfileMutation } from 'src/redux/features/auth/authApi';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  profile_pic: schemaHelper.file({ message: { required_error: 'Avatar is required!' } }),
  name: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
});

// ----------------------------------------------------------------------

export function UpdateProfileForm() {
  const [updateProfile] = useUpdateProfileMutation();
  const user = useAppSelector(selectCurrentUser);

  const [errorMsg, setErrorMsg] = useState('');

  const defaultValues = useMemo(
    () => ({
      profile_pic: user?.profile_pic || null,
      name: user?.name || '',
      email: user?.email || '',
      contact_number: user?.contact_number || '',
    }),
    [user]
  );

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      const formData = new FormData();
      const updatedData = {
        name: data.name,
        email: data.email,
      };
      formData.append('data', JSON.stringify(updatedData));
      if (data.profile_pic instanceof File) {
        formData.append('profile_pic', data.profile_pic);
      }

      const res = await updateProfile(formData);
      if (res?.error) {
        setErrorMsg((res?.error as IErrorResponse)?.data?.message);
      } else {
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack direction="column" alignItems="center">
        {!!errorMsg && (
          <Alert severity="error" sx={{ mb: 3, width: { xs: '100%', sm: '90%', md: '80%' } }}>
            {errorMsg}
          </Alert>
        )}

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ width: { xs: '100%', sm: '90%', md: '80%' } }}
        >
          <Card sx={{ pt: 10, pb: 5, px: 3, width: { xs: '100%', sm: '40%', md: '30%' } }}>
            <Box sx={{ mb: 5 }}>
              <Field.UploadAvatar
                name="profile_pic"
                maxSize={3145728}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
          <Card sx={{ py: 10, px: 5, width: { xs: '100%', sm: '60%', md: '70%' } }}>
            <Stack spacing={2}>
              <Field.Text name="name" label="Full name" />
              <Field.Text name="email" label="Email address" />
              <Field.Text name="contact_number" label="Contact number" disabled />
            </Stack>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Update
              </LoadingButton>
            </Stack>
          </Card>
        </Stack>
      </Stack>
    </Form>
  );
}
