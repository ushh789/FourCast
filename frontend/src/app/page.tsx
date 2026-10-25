import { redirect } from 'next/navigation';

/**
 * Home page - redirects to login
 */
export default function Home() {
  redirect('/auth/login');
}
