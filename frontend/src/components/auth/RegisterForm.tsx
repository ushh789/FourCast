'use client';

import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '../../hooks/api';
import { registerSchema, type RegisterFormData } from '../../lib/validation';
import { FormField } from '../forms/FormField';
import { ErrorMessage } from '../common/ErrorMessage';
import Link from 'next/link';

export function RegisterForm() {
  const { mutate: register, isPending, error, isError } = useRegister();
  const { control, handleSubmit, formState: { isValid } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    const { email, firstName, lastName, password } = data;
    register({ email, firstName, lastName, password });
  };

  const errorMessage = error?.response?.data?.message || 'An error occurred during registration. Please try again.';

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      {isError && (
        <Box sx={{ marginBottom: 2 }}>
          <ErrorMessage 
            message={errorMessage} 
            title="Registration Error"
            severity="error"
          />
        </Box>
      )}

      <Box sx={{ marginBottom: 2 }}>
        <FormField 
          name="firstName" 
          control={control} 
          label="First Name"
          type="text"
          placeholder="John"
          autoComplete="given-name"
          inputProps={{ maxLength: 50 }}
        />
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <FormField 
          name="lastName" 
          control={control} 
          label="Last Name"
          type="text"
          placeholder="Doe"
          autoComplete="family-name"
          inputProps={{ maxLength: 50 }}
        />
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <FormField 
          name="email" 
          control={control}
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          inputProps={{ maxLength: 100 }}
        />
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <FormField 
          name="password" 
          control={control}
          label="Password"
          type="password"
          autoComplete="new-password"
        />
      </Box>

      <Box sx={{ marginBottom: 3 }}>
        <FormField 
          name="confirmPassword" 
          control={control} 
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
        />
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isPending || !isValid}
        sx={{
          position: 'relative',
          py: 1.5,
        }}
      >
        {isPending ? (
          <>
            <CircularProgress
              size={20}
              sx={{
                position: 'absolute',
                left: '50%',
                marginLeft: '-10px',
                color: 'white',
              }}
            />
            <span style={{ visibility: 'hidden' }}>Create Account</span>
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      <Box sx={{ marginTop: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
