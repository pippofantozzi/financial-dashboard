import { redirect } from 'next/navigation';

export default function Home() {
  // TODO: Add Clerk authentication check here. Redirect to login if not authenticated.
  redirect('/dashboard');
  // For now, we redirect directly to the dashboard.
  // Once Clerk is integrated, this should check auth status.
  // return null; // Or a loading indicator while redirecting
}
