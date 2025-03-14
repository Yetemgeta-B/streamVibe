import Image from 'next/image'
import Link from 'next/link'
import { PlayIcon, InformationCircleIcon } from '@heroicons/react/24/solid'
import MovieCard from './components/MovieCard'
import HeroCarousel from './components/HeroCarousel'
import { tmdbApi, type Movie } from './utils/tmdb'

async function getMovies() {
  const [trending, popular, topRated] = await Promise.all([
    tmdbApi.getTrending(),
    tmdbApi.getPopular(),
    tmdbApi.getMoviesByGenre(28) // Action movies
  ])

  return {
    featured: trending.slice(0, 5) as Movie[], // Take top 5 for carousel
    trending: trending.slice(5, 10) as Movie[],
    popular: popular.slice(0, 10) as Movie[],
    actionMovies: topRated.slice(0, 5) as Movie[]
  }
}

export default async function Home() {
  const { featured, trending, popular, actionMovies } = await getMovies()

  return (
    <main className="animate-fade-in">
      {/* Hero Section with Carousel */}
      <HeroCarousel featured={featured} />

      {/* Content Sections */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Trending Now Section */}
        <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="section-title bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent inline-block mb-6">Trending Now</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {trending.map((movie: Movie, index: number) => (
              <div key={movie.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
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
        </section>

        {/* Action Movies Section */}
        <section className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <h2 className="section-title bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent inline-block mb-6">Action Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {actionMovies.map((movie: Movie, index: number) => (
              <div key={movie.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
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
        </section>

        {/* Popular Movies Section */}
        <section className="animate-slide-up" style={{ animationDelay: '600ms' }}>
          <h2 className="section-title bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent inline-block mb-6">Popular Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {popular.map((movie: Movie, index: number) => (
              <div key={movie.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
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
        </section>
      </div>
    </main>
  )
} 