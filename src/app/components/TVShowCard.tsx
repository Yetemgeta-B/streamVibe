'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlayIcon } from '@heroicons/react/24/solid';
import { StarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface TVShowCardProps {
  id: string;
  title: string;
  posterPath: string;
  year: string;
  rating: string;
}

export default function TVShowCard({ id, title, posterPath, year, rating }: TVShowCardProps) {
  return (
    <Link href={`/tv-shows/${id}`}>
      <div className="movie-card group card-hover animate-fade-in">
        <div className="aspect-w-2 aspect-h-3 relative overflow-hidden rounded-lg">
          <Image
            src={posterPath}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-xs bg-black/50 px-2 py-1 rounded-full">
                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{rating}</span>
                </div>
                <div className="flex items-center text-xs bg-black/50 px-2 py-1 rounded-full">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <span>TV Series</span>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-md flex items-center justify-center py-2 transition-all btn-hover-effect">
                <PlayIcon className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">Play</span>
              </button>
            </div>
          </div>
        </div>
        <div className="p-2 mt-2">
          <h3 className="movie-title truncate text-base font-medium group-hover:text-purple-400 transition-colors">{title}</h3>
          <p className="movie-info text-sm text-gray-400">{year}</p>
        </div>
      </div>
    </Link>
  );
} 
 