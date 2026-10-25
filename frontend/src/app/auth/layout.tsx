'use client';

import { AuthLayout } from '../../components/auth/AuthLayout';
import type { ReactNode } from 'react';

export default function AuthLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
