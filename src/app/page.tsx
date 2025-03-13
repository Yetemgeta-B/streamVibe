import Image from 'next/image'
import Link from 'next/link'
import { PlayIcon, InformationCircleIcon } from '@heroicons/react/24/solid'
import MovieCard from './components/MovieCard'
import { tmdbApi, type Movie } from './utils/tmdb'

async function getMovies() {
  const [trending, popular, topRated] = await Promise.all([
    tmdbApi.getTrending(),
    tmdbApi.getPopular(),
    tmdbApi.getMoviesByGenre(28) // Action movies
  ])

  return {
    featured: trending[0] as Movie,
    trending: trending.slice(1, 6) as Movie[],
    popular: popular.slice(0, 10) as Movie[],
    actionMovies: topRated.slice(0, 5) as Movie[]
  }
}

export default async function Home() {
  const { featured, trending, popular, actionMovies } = await getMovies()

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[85vh]">
        <div className="featured-gradient z-10" />
        <div className="absolute inset-0">
          <Image
            src={tmdbApi.getImageUrl(featured.backdrop_path, 'original')}
            alt={featured.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-20 h-full flex items-end px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-xl">
            <h1 className="text-5xl sm:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{featured.title}</h1>
            <div className="flex items-center space-x-3 text-sm mb-4 text-gray-300">
              <span>{new Date(featured.release_date).getFullYear()}</span>
              <span className="w-1 h-1 rounded-full bg-gray-500"></span>
              <span>Rating: {featured.vote_average.toFixed(1)}</span>
            </div>
            <p className="text-base mb-6 text-gray-300">{featured.overview}</p>
            <div className="flex space-x-4">
              <Link 
                href={`/movies/${featured.id}`} 
                className="btn-primary bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 inline-flex items-center space-x-2 px-6 py-3 shadow-lg"
              >
                <PlayIcon className="h-5 w-5" />
                <span>Play</span>
              </Link>
              <Link
                href={`/movies/${featured.id}`}
                className="btn-secondary inline-flex items-center space-x-2 border border-gray-700 hover:border-cyan-500"
              >
                <InformationCircleIcon className="h-5 w-5" />
                <span>More Info</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Trending Now Section */}
        <section>
          <h2 className="section-title">Trending Now</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {trending.map((movie: Movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id.toString()}
                title={movie.title}
                posterPath={tmdbApi.getImageUrl(movie.poster_path)}
                year={new Date(movie.release_date).getFullYear().toString()}
                rating={movie.vote_average.toFixed(1)}
              />
            ))}
          </div>
        </section>

        {/* Action Movies Section */}
        <section>
          <h2 className="section-title">Action Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {actionMovies.map((movie: Movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id.toString()}
                title={movie.title}
                posterPath={tmdbApi.getImageUrl(movie.poster_path)}
                year={new Date(movie.release_date).getFullYear().toString()}
                rating={movie.vote_average.toFixed(1)}
              />
            ))}
          </div>
        </section>

        {/* Popular Movies Section */}
        <section>
          <h2 className="section-title">Popular Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {popular.map((movie: Movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id.toString()}
                title={movie.title}
                posterPath={tmdbApi.getImageUrl(movie.poster_path)}
                year={new Date(movie.release_date).getFullYear().toString()}
                rating={movie.vote_average.toFixed(1)}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
} 