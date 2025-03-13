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
      <div className="movie-card group">
        <div className="aspect-w-2 aspect-h-3 relative">
          <Image
            src={posterPath}
            alt={title}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          <div className="card-overlay">
            <div className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs">
                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{rating}</span>
                </div>
                <div className="flex items-center text-xs">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <span>TV Series</span>
                </div>
              </div>
              <button className="w-full mt-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-md flex items-center justify-center py-1.5 transition-all">
                <PlayIcon className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">Play</span>
              </button>
            </div>
          </div>
        </div>
        <div className="p-2">
          <h3 className="movie-title truncate text-base">{title}</h3>
          <p className="movie-info">{year}</p>
        </div>
      </div>
    </Link>
  );
} 
 