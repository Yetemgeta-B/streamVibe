'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { tmdbApi } from '@/app/utils/tmdb';
import MovieCard from '@/app/components/MovieCard';
import TVShowCard from '@/app/components/TVShowCard';
import Link from 'next/link';

type SearchResult = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type: 'movie' | 'tv';
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'movies' | 'tvshows'>('all');
  const [totalResults, setTotalResults] = useState(0);
  
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setTotalResults(0);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const movieResults = await tmdbApi.searchMovies(query);
      const tvResults = await tmdbApi.searchTVShows(query);
      
      const formattedMovies = movieResults.map(movie => ({
        ...movie,
        media_type: 'movie' as const
      }));
      
      const formattedTVShows = tvResults.map(show => ({
        ...show,
        media_type: 'tv' as const
      }));
      
      const combined = [...formattedMovies, ...formattedTVShows].sort(
        (a, b) => b.vote_average - a.vote_average
      );
      
      setResults(combined);
      setTotalResults(combined.length);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };
  
  const filteredResults = results.filter(result => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'movies') return result.media_type === 'movie';
    if (activeFilter === 'tvshows') return result.media_type === 'tv';
    return true;
  });
  
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-12 animate-slide-up">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          {initialQuery ? `Search Results for "${initialQuery}"` : 'Search Movies & TV Shows'}
        </h1>
        
        <form onSubmit={handleSearch} className="max-w-3xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
              placeholder="Search for movies, TV shows, actors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-r-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 btn-hover-effect"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      
      {/* Filters */}
      <div className="mb-8 flex items-center space-x-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400 mr-2" />
        <span className="text-gray-400 mr-4">Filter:</span>
        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'movies', label: 'Movies' },
            { id: 'tvshows', label: 'TV Shows' }
          ].map((filter) => (
            <button
              key={filter.id}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105'
              }`}
              onClick={() => setActiveFilter(filter.id as any)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center py-20 animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20 animate-fade-in">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => performSearch(searchQuery)}
            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors btn-hover-effect"
          >
            Try Again
          </button>
        </div>
      ) : filteredResults.length > 0 ? (
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <p className="text-gray-400 mb-6">
            Found {filteredResults.length} {activeFilter === 'all' ? 'results' : activeFilter === 'movies' ? 'movies' : 'TV shows'}
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredResults.map((result, index) => (
              <div key={`${result.media_type}-${result.id}`} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in">
                {result.media_type === 'movie' ? (
                  <MovieCard
                    id={result.id.toString()}
                    title={result.title || ''}
                    posterPath={tmdbApi.getImageUrl(result.poster_path)}
                    year={result.release_date ? new Date(result.release_date).getFullYear().toString() : ''}
                    rating={result.vote_average.toFixed(1)}
                  />
                ) : (
                  <TVShowCard
                    id={result.id.toString()}
                    title={result.name || ''}
                    posterPath={tmdbApi.getImageUrl(result.poster_path)}
                    year={result.first_air_date ? new Date(result.first_air_date).getFullYear().toString() : ''}
                    rating={result.vote_average.toFixed(1)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : initialQuery ? (
        <div className="text-center py-20 animate-fade-in">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">No results found</h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            We couldn't find any matches for "{initialQuery}". Please try another search term.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/" className="btn-secondary transition-all duration-300 hover:scale-105">
              Back to Home
            </Link>
            <Link href="/movies" className="btn-primary bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 btn-hover-effect">
              Browse Movies
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 animate-fade-in">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Start searching</h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Enter a search term above to find movies, TV shows, and more.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/movies" className="btn-primary bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 btn-hover-effect">
              Browse Movies
            </Link>
            <Link href="/tv-shows" className="btn-secondary transition-all duration-300 hover:scale-105">
              Browse TV Shows
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 