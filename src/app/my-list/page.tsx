'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HeartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { tmdbApi } from '../utils/tmdb';

interface MyListItem {
  id: string;
  title: string;
  posterPath: string;
  addedAt: string;
}

export default function MyListPage() {
  const router = useRouter();
  const [myList, setMyList] = useState<MyListItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);

    if (!loginStatus) {
      router.push('/auth/login');
      return;
    }

    // Get list from localStorage
    const savedList = JSON.parse(localStorage.getItem('myList') || '[]');
    setMyList(savedList);
  }, [router]);

  const handleRemoveFromList = (id: string) => {
    const updatedList = myList.filter(item => item.id !== id);
    localStorage.setItem('myList', JSON.stringify(updatedList));
    setMyList(updatedList);
  };

  if (!isLoggedIn) {
    return null; // Will redirect to login
  }

  return (
    <main className="pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-8">
          My List
        </h1>

        {myList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {myList.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
                <Link href={`/movies/${item.id}`} className="block">
                  <div className="aspect-w-2 aspect-h-3 relative">
                    <Image
                      src={tmdbApi.getImageUrl(item.posterPath)}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{item.title}</h3>
                    <p className="text-gray-400 text-sm">
                      Added on {new Date(item.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <button
                    onClick={() => handleRemoveFromList(item.id)}
                    className="w-full py-2 px-3 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-300 flex items-center justify-center transition-colors"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/30 rounded-lg p-12 text-center">
            <HeartIcon className="h-16 w-16 mx-auto text-gray-500 mb-4" />
            <h2 className="text-xl text-gray-300 mb-2">Your list is empty</h2>
            <p className="text-gray-500 mb-6">
              Start adding movies and TV shows to your list
            </p>
            <Link
              href="/movies"
              className="btn-primary inline-flex bg-gradient-to-r from-cyan-500 to-blue-500"
            >
              Browse Movies
            </Link>
          </div>
        )}
      </div>
    </main>
  );
} 