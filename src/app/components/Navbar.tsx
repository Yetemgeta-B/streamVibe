'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check login status from localStorage on component mount
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);

    // Setup event listener for storage changes
    const handleStorageChange = () => {
      const updatedLoginStatus = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(updatedLoginStatus);
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="bg-[#0f172a]/95 backdrop-blur-sm fixed w-full z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              StreamVibe
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link href="/" className="nav-link">
                Home
              </Link>
              <Link href="/movies" className="nav-link">
                Movies
              </Link>
              <Link href="/tv-shows" className="nav-link">
                TV Shows
              </Link>
              {isLoggedIn && (
                <Link href="/my-list" className="nav-link">
                  My List
                </Link>
              )}
            </div>
          </div>

          {/* Search & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-300 hover:text-cyan-400 transition-colors"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
            
            {isLoggedIn ? (
              <button
                onClick={handleSignOut}
                className="btn-secondary border border-gray-700 hover:border-cyan-500"
              >
                Sign Out
              </button>
            ) : (
              <div className="flex space-x-3">
                <Link href="/auth/login" className="btn-secondary border border-gray-700 hover:border-cyan-500">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-primary bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-3">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-300 hover:text-cyan-400 transition-colors"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-cyan-400 focus:outline-none"
            >
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="bg-[#1e293b] p-3 border-t border-gray-800">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-500 focus:outline-none text-white"
                placeholder="Search for movies, TV shows..."
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-4 text-cyan-500 hover:text-cyan-400"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1e293b] border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="mobile-nav-link">
              Home
            </Link>
            <Link href="/movies" className="mobile-nav-link">
              Movies
            </Link>
            <Link href="/tv-shows" className="mobile-nav-link">
              TV Shows
            </Link>
            {isLoggedIn && (
              <Link href="/my-list" className="mobile-nav-link">
                My List
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-800">
            {isLoggedIn ? (
              <button
                onClick={handleSignOut}
                className="mobile-nav-link w-full text-left"
              >
                Sign Out
              </button>
            ) : (
              <div className="space-y-2 px-2">
                <Link href="/auth/login" className="mobile-nav-link block">
                  Sign In
                </Link>
                <Link href="/auth/register" className="mobile-nav-link block">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 