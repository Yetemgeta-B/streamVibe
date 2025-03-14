'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, ClockIcon } from '@heroicons/react/24/solid';
import { tmdbApi, type Movie } from '@/app/utils/tmdb';
import MovieCard from '@/app/components/MovieCard';
import VideoPlayer from '@/app/components/VideoPlayer';
import CastCard from '@/app/components/CastCard';
import ReviewCard from '@/app/components/ReviewCard';
import AddToListButton from '@/app/components/AddToListButton';

function getMovieDetails(id: string) {
  return Promise.all([
    tmdbApi.getMovieDetails(id),
    tmdbApi.getSimilarMovies(id)
  ]).then(([movieDetails, similarMovies]) => {
    return {
      movie: movieDetails,
      similar: similarMovies.slice(0, 5)
    };
  });
}

export default function MoviePage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setLoading(true);
    getMovieDetails(params.id)
      .then(data => {
        setMovie(data.movie);
        setSimilar(data.similar);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again later.');
        setLoading(false);
      });
  }, [params.id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link href="/movies" className="btn-primary">
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }
  
  if (!movie) return null;
  
  // Find trailer
  const trailer = movie.videos?.results.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );
  
  // Format runtime
  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;
  const formattedRuntime = `${hours}h ${minutes}m`;
  
  return (
    <main>
      {/* Hero Section with Backdrop */}
      <section className="relative">
        <div className="absolute inset-0">
          <Image
            src={tmdbApi.getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f172a]/70 to-[#0f172a]" />
        </div>
        
        <div className="relative z-10 pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Movie Poster */}
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={tmdbApi.getImageUrl(movie.poster_path, 'w500')}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="w-full h-auto"
                />
              </div>
              
              <div className="mt-6 flex flex-col gap-4">
                <AddToListButton movieId={params.id} title={movie.title} posterPath={movie.poster_path} />
                
                <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
                  <div>
                    <h3 className="text-gray-400 text-sm">Rating</h3>
                    <div className="flex items-center">
                      <StarIcon className="h-5 w-5 text-yellow-500 mr-1" />
                      <span className="font-bold">{movie.vote_average.toFixed(1)}</span>
                      <span className="text-gray-400 text-sm ml-1">({movie.vote_count})</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-400 text-sm">Length</h3>
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-gray-400 mr-1" />
                      <span>{formattedRuntime}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-400 text-sm">Year</h3>
                    <div className="flex items-center">
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Movie Details */}
            <div className="w-full md:w-2/3">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
              
              {movie.tagline && (
                <p className="text-xl text-gray-400 mb-6 italic">"{movie.tagline}"</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <Link 
                    key={genre.id} 
                    href={`/movies?genre=${genre.id}`}
                    className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">Overview</h2>
                <p className="text-gray-300">{movie.overview}</p>
              </div>
              
              {movie.credits?.cast && movie.credits.cast.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-3">Cast</h2>
                  <div className="flex space-x-4 overflow-x-auto pb-4">
                    {movie.credits.cast.slice(0, 10).map((person) => (
                      <CastCard
                        key={person.id}
                        name={person.name}
                        character={person.character}
                        profilePath={person.profile_path ? tmdbApi.getImageUrl(person.profile_path) : '/placeholder-avatar.png'}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Video Player for Trailer */}
              {trailer && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-3">Trailer</h2>
                  <div className="aspect-w-16 aspect-h-9">
                    <VideoPlayer videoId={trailer.key} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Similar Movies Section */}
      {similar.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
          <h2 className="section-title">Similar Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {similar.map((similarMovie) => (
              <MovieCard
                key={similarMovie.id}
                id={similarMovie.id.toString()}
                title={similarMovie.title}
                posterPath={tmdbApi.getImageUrl(similarMovie.poster_path)}
                year={new Date(similarMovie.release_date).getFullYear().toString()}
                rating={similarMovie.vote_average.toFixed(1)}
              />
            ))}
          </div>
        </section>
      )}
      
      {/* Reviews Section */}
      {movie.reviews?.results && movie.reviews.results.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto border-t border-gray-800">
          <h2 className="section-title">Reviews</h2>
          <div className="space-y-6">
            {movie.reviews.results.slice(0, 3).map((review) => (
              <ReviewCard
                key={review.id}
                author={review.author}
                content={review.content}
                rating={review.author_details?.rating}
                avatar={
                  review.author_details?.avatar_path
                    ? review.author_details.avatar_path.startsWith('/http')
                      ? review.author_details.avatar_path.slice(1)
                      : tmdbApi.getImageUrl(review.author_details.avatar_path)
                    : '/placeholder-avatar.png'
                }
                date={new Date(review.created_at).toLocaleDateString()}
              />
            ))}
          </div>
          
          {movie.reviews.results.length > 3 && (
            <div className="mt-8 text-center">
              <Link
                href={`/movies/${params.id}/reviews`}
                className="btn-secondary inline-flex items-center space-x-2 border border-gray-700 hover:border-cyan-500"
              >
                View All Reviews
              </Link>
            </div>
          )}
        </section>
      )}
    </main>
  );
} 