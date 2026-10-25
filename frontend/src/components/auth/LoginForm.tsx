"use client";

import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../../hooks/api";
import { loginSchema, type LoginFormData } from "../../lib/validation";
import { FormField } from "../forms/FormField";
import { ErrorMessage } from "../common/ErrorMessage";
import Link from "next/link";

export function LoginForm() {
  const { mutate: login, isPending, error, isError } = useLogin();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    login(data);
  };

  const errorMessage =
    error?.response?.data?.message ||
    "An error occurred during login. Please try again.";

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: "100%" }}
    >
      {isError && (
        <Box sx={{ marginBottom: 2 }}>
          <ErrorMessage
            message={errorMessage}
            title="Login Error"
            severity="error"
          />
        </Box>
      )}

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

      <Box sx={{ marginBottom: 3 }}>
        <FormField
          name="password"
          control={control}
          label="Password"
          type="password"
          autoComplete="current-password"
        />
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isPending || !isValid}
        sx={{
          position: "relative",
          py: 1.5,
        }}
      >
        {isPending ? (
          <>
            <CircularProgress
              size={20}
              sx={{
                position: "absolute",
                left: "50%",
                marginLeft: "-10px",
                color: "white",
              }}
            />
            <span style={{ visibility: "hidden" }}>Sign In</span>
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      <Box sx={{ marginTop: 2, textAlign: "center" }}>
        <Typography variant="body2" color="textSecondary">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            style={{ color: "#1976d2", textDecoration: "none" }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
