'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (email: string, password: string, name?: string) => void;
  isLoading: boolean;
}

export default function AuthForm({ type, onSubmit, isLoading }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'register') {
      onSubmit(email, password, name);
    } else {
      onSubmit(email, password);
    }
  };

  return (
    <div className="bg-black/60 p-8 rounded-lg max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {type === 'login' ? 'Sign In' : 'Create an Account'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {type === 'register' && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-red-600 focus:outline-none"
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-red-600 focus:outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-red-600 focus:outline-none"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary"
          >
            {isLoading ? 'Loading...' : type === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        {type === 'login' ? (
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-red-600 hover:underline">
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link href="/auth/login" className="text-red-600 hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
} 