'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react'; // Using lucide-react for a spinner icon
import { storeSession } from '@/lib/utils';

const GoogleLoadingContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthTokenAndFetchUser, setAuthLoading } = useAuth(); // Assuming these functions exist
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('Processing Google sign-in...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      setMessage('Token received. Authenticating...');
      // Store the token in cookies, matching the server-side cookie name and options if possible
      // The server already sets an httpOnly cookie. This client-side cookie helps the auth context
      // immediately know about the token without needing an extra API call just to check auth status.
      storeSession(token)

      setAuthLoading(true);
      setAuthTokenAndFetchUser(token)
        .then(() => {
          setMessage('Authentication successful! Redirecting...');
          // Redirect to dashboard or home page after successful login
          router.replace('/dashboard'); // Or your desired redirect path
        })
        .catch((err) => {
          console.error('Google sign-in error:', err);
          setError(
            err.response?.data?.message || 
            'Failed to authenticate with Google. Please try again.'
          );
          setMessage('Authentication failed.');
          Cookies.remove('authorization'); // Clean up cookie on failure
          setAuthLoading(false);
        });
    } else {
      setError('No token found in URL. Redirecting to login.');
      setMessage('Invalid request.');
      // Redirect to login if no token is present
      setTimeout(() => {
        router.replace('/auth/login');
      }, 3000);
    }
  }, [searchParams, router, setAuthTokenAndFetchUser, setAuthLoading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
          Google Sign-In
        </h1>
        {error ? (
          <>
            <p className="text-red-500 mb-4">{error}</p>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <Loader2 className="h-12 w-12 text-[var(--primary)] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

// Wrap with Suspense for useSearchParams
const GoogleLoadingPage = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><Loader2 className="h-12 w-12 text-[var(--primary)] animate-spin"/></div>}>
      <GoogleLoadingContent />
    </Suspense>
  )
}

export default GoogleLoadingPage; 