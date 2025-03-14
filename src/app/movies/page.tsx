'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import MovieCard from '../components/MovieCard';
import { tmdbApi, TMDB_GENRES, type Movie } from '../utils/tmdb';
import { useDebounce } from 'use-debounce';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        let results;
        if (debouncedSearch) {
          results = await tmdbApi.searchMovies(debouncedSearch);
        } else if (selectedGenre !== 'All') {
          const genreId = TMDB_GENRES.find(g => g.name === selectedGenre)?.id;
          results = genreId ? await tmdbApi.getMoviesByGenre(genreId) : [];
        } else {
          results = await tmdbApi.getPopular();
        }
        setMovies(results);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [debouncedSearch, selectedGenre]);

  return (
    <main className="pt-8 pb-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Movies
          </h1>
          
          {/* Search & Filter Mobile Toggle */}
          <div className="flex md:hidden space-x-2">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-500 focus:outline-none text-white transition-all duration-300 focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 transition-all duration-300 hover:bg-gray-700 hover:border-cyan-500"
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
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-500 focus:outline-none text-white transition-all duration-300 focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
        </div>

        {/* Genre Filter */}
        <div className={`mb-8 animate-slide-up ${isFilterOpen || 'hidden md:block'}`} style={{ animationDelay: '100ms' }}>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGenre('All')}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                selectedGenre === 'All'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105'
              }`}
            >
              All
            </button>
            {TMDB_GENRES.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.name)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  selectedGenre === genre.name
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            {movies.map((movie, index) => (
              <div key={movie.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in">
                <MovieCard
                  id={movie.id.toString()}
                  title={movie.title}
                  posterPath={tmdbApi.getImageUrl(movie.poster_path)}
                  year={new Date(movie.release_date).getFullYear().toString()}
                  rating={movie.vote_average.toFixed(1)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-800/30 rounded-lg animate-fade-in">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-500 mb-4 animate-pulse" />
            <p className="text-xl text-gray-400 mb-2">No movies found</p>
            <p className="text-gray-500 text-center">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}
      </div>
    </main>
  );
} 