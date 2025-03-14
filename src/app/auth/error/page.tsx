'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorCode, setErrorCode] = useState<string>('');

  useEffect(() => {
    const error = searchParams?.get('error');
    setErrorCode(error || 'unknown');

    // Map error codes to user-friendly messages
    switch (error) {
      case 'CredentialsSignin':
        setErrorMessage('Invalid email or password. Please check your credentials and try again.');
        break;
      case 'OAuthSignin':
        setErrorMessage('Error occurred while signing in with a social provider.');
        break;
      case 'OAuthCallback':
        setErrorMessage('Error occurred during the social sign-in callback.');
        break;
      case 'OAuthCreateAccount':
        setErrorMessage('Error creating a new account with social sign-in.');
        break;
      case 'EmailCreateAccount':
        setErrorMessage('Error creating a new account with email.');
        break;
      case 'Callback':
        setErrorMessage('Error during authentication callback process.');
        break;
      case 'OAuthAccountNotLinked':
        setErrorMessage('Email already in use with another sign-in method.');
        break;
      case 'AuthError':
        setErrorMessage('Authentication system error. Please try again later.');
        break;
      case 'AccessDenied':
        setErrorMessage('Access denied. You do not have permission to access this resource.');
        break;
      case 'Verification':
        setErrorMessage('The verification link may have expired or was already used.');
        break;
      default:
        setErrorMessage('An unexpected authentication error occurred. Please try again later.');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-900/30 border-2 border-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Error</h2>
          <p className="text-gray-400 mb-6">{errorMessage}</p>
          
          {errorCode === 'CredentialsSignin' ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Tip: You can use these demo credentials: 
                <br />Email: <span className="text-cyan-500">user@example.com</span>
                <br />Password: <span className="text-cyan-500">password123</span>
              </p>
              <Link
                href="/auth/signin"
                className="inline-block w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none transition-all duration-300"
              >
                Try Again
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <Link
                href="/auth/signin"
                className="inline-block w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none transition-all duration-300"
              >
                Back to Sign In
              </Link>
              <Link
                href="/"
                className="mt-3 inline-block w-full py-3 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none transition-all duration-300"
              >
                Go to Homepage
              </Link>
            </div>
          )}
        </div>
        
        {/* Error details for debugging */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-700">
            <p className="text-xs text-gray-500 font-mono">Error Code: {errorCode}</p>
          </div>
        )}
      </div>
    </div>
  );
} 