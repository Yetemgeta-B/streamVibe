'use client';

import { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';

interface AddToListButtonProps {
  movieId: string;
  title: string;
  posterPath: string;
}

export default function AddToListButton({ movieId, title, posterPath }: AddToListButtonProps) {
  const [isInList, setIsInList] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);

    // Check if movie is in list
    if (loginStatus) {
      const myList = JSON.parse(localStorage.getItem('myList') || '[]');
      setIsInList(myList.some((item: { id: string }) => item.id === movieId));
    }
  }, [movieId]);

  const handleToggleList = () => {
    if (!isLoggedIn) {
      // Redirect to login page
      window.location.href = '/auth/login';
      return;
    }

    // Get current list
    const myList = JSON.parse(localStorage.getItem('myList') || '[]');
    
    if (isInList) {
      // Remove from list
      const updatedList = myList.filter((item: { id: string }) => item.id !== movieId);
      localStorage.setItem('myList', JSON.stringify(updatedList));
      setIsInList(false);
    } else {
      // Add to list
      const updatedList = [
        ...myList,
        {
          id: movieId,
          title,
          posterPath,
          addedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('myList', JSON.stringify(updatedList));
      setIsInList(true);
    }
  };

  return (
    <button
      onClick={handleToggleList}
      className={`w-full py-3 px-4 rounded-lg flex items-center justify-center transition-colors ${
        isInList 
          ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white' 
          : 'bg-gray-800 hover:bg-gray-700 text-white'
      }`}
    >
      {isInList ? (
        <>
          <HeartIcon className="h-5 w-5 mr-2" />
          <span>Remove from My List</span>
        </>
      ) : (
        <>
          <HeartOutlineIcon className="h-5 w-5 mr-2" />
          <span>Add to My List</span>
        </>
      )}
    </button>
  );
} 