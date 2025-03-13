'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { tmdbApi, TMDB_GENRES } from '../utils/tmdb';
import { useDebounce } from 'use-debounce';
import TVShowCard from '../components/TVShowCard';

interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  overview: string;
}

export default function TVShowsPage() {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchTVShows = async () => {
      setIsLoading(true);
      try {
        let results;
        if (debouncedSearch) {
          results = await tmdbApi.searchTVShows(debouncedSearch);
        } else if (selectedGenre !== 'All') {
          const genreId = TMDB_GENRES.find(g => g.name === selectedGenre)?.id;
          results = genreId ? await tmdbApi.getTVShowsByGenre(genreId) : [];
        } else {
          results = await tmdbApi.getPopularTVShows();
        }
        setTVShows(results);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
        setTVShows([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTVShows();
  }, [debouncedSearch, selectedGenre]);

  return (
    <main className="pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            TV Shows
          </h1>
          
          {/* Search & Filter Mobile Toggle */}
          <div className="flex md:hidden space-x-2">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-500 focus:outline-none text-white"
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </button>
          </div>
          
          {/* Desktop Search */}
          <div className="hidden md:block relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-500 focus:outline-none text-white"
            />
          </div>
        </div>

        {/* Genre Filter */}
        <div className={`mb-8 ${isFilterOpen || 'hidden md:block'}`}>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGenre('All')}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedGenre === 'All'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            {TMDB_GENRES.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.name)}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedGenre === genre.name
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* TV Shows Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : tvShows.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {tvShows.map((show) => (
              <TVShowCard
                key={show.id}
                id={show.id.toString()}
                title={show.name}
                posterPath={tmdbApi.getImageUrl(show.poster_path)}
                year={new Date(show.first_air_date).getFullYear().toString()}
                rating={show.vote_average.toFixed(1)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-800/30 rounded-lg">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-500 mb-4" />
            <p className="text-xl text-gray-400 mb-2">No TV shows found</p>
            <p className="text-gray-500 text-center">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}
      </div>
    </main>
  );
} 