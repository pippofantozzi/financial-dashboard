import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import LandingPage from '@/components/landing-page';

export default async function Home() {
  const { userId } = await auth();
  
  // If user is authenticated, redirect to dashboard
  if (userId) {
    redirect('/dashboard');
  }
  
  // Otherwise, show the landing page for unauthenticated users
  return <LandingPage />;
}
