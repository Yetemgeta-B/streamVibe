'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
    }
  }, [isSearchOpen]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
    }
  };

  return (
    <nav className={`nav-container ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center animate-pulse-slow shadow-glow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                  <path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold animate-gradient-text text-glow">
                StreamVibe
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="nav-link relative py-2 text-gray-300 hover:text-white transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-cyan-400 after:to-blue-500 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              Home
            </Link>
            <Link 
              href="/movies" 
              className="nav-link relative py-2 text-gray-300 hover:text-white transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-cyan-400 after:to-blue-500 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              Movies
            </Link>
            <Link 
              href="/tv-shows" 
              className="nav-link relative py-2 text-gray-300 hover:text-white transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-cyan-400 after:to-blue-500 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              TV Shows
            </Link>
            {status === 'authenticated' && (
              <Link 
                href="/my-list" 
                className="nav-link relative py-2 text-gray-300 hover:text-white transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-cyan-400 after:to-blue-500 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                My List
              </Link>
            )}

            {/* Enhanced Search Button and Input */}
            <div className="relative ml-4">
              <button
                onClick={toggleSearch}
                className="search-icon-btn"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-300 hover:text-white transition-colors z-10 relative" />
              </button>
              <div className={`search-input-container ${isSearchOpen ? 'active' : ''}`}>
                <form onSubmit={handleSearch}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search movies, TV shows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                    onBlur={() => {
                      if (!searchQuery.trim()) {
                        setIsSearchOpen(false);
                      }
                    }}
                  />
                </form>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            {status === 'authenticated' ? (
              <div className="relative ml-3">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                >
                  <span className="sr-only">Open user menu</span>
                  {session?.user?.image ? (
                    <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-transparent hover:border-cyan-400 transition-colors duration-300 shadow-glow-sm">
                      <Image
                        src={session.user.image}
                        alt={session.user.name || ''}
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white flex items-center justify-center shadow-glow-sm">
                      <span className="text-sm font-medium">
                        {session?.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </button>

                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-glow bg-gray-900 backdrop-blur-md ring-1 ring-cyan-500/20 animate-fade-in z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-800">
                        <p className="text-sm font-medium text-white">{session?.user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
                      </div>
                      {session?.user?.email === 'streamvibe@gmail.com' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/my-list"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        My List
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-glow-sm hover:shadow-glow btn-hover-effect"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 ml-4 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden rounded-b-xl ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/90 backdrop-blur-md">
          <div className="px-3 py-2">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800/50 border border-gray-700 rounded-l-md w-full px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 input-glow"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-2 rounded-r-md"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
          
          <Link
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/movies"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Movies
          </Link>
          <Link
            href="/tv-shows"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            TV Shows
          </Link>
          {status === 'authenticated' && (
            <Link
              href="/my-list"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              My List
            </Link>
          )}
          
          {/* Mobile Auth Controls */}
          {status === 'authenticated' ? (
            <>
              <div className="px-3 py-2 border-t border-gray-800 mt-2 flex items-center">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || ''}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full mr-3"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white flex items-center justify-center mr-3">
                    <span className="text-sm font-medium">
                      {session?.user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{session?.user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
                </div>
              </div>
              {session?.user?.email === 'streamvibe@gmail.com' && (
                <Link
                  href="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <Link
                href="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="block px-3 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-center font-medium mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 