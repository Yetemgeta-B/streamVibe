import axios from 'axios';

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  tagline?: string;
  runtime?: number;
  genres?: { id: number; name: string }[];
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      profile_path: string | null;
    }[];
  };
  videos?: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
  reviews?: {
    results: {
      id: string;
      author: string;
      content: string;
      created_at: string;
      author_details?: {
        avatar_path: string | null;
        rating: number | null;
      };
    }[];
  };
}

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const tmdbApi = {
  getTrending: async () => {
    const response = await axios.get(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`
    );
    return response.data.results;
  },

  getPopular: async () => {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`
    );
    return response.data.results;
  },

  getMovieDetails: async (movieId: string) => {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,reviews`
    );
    return response.data;
  },

  getSimilarMovies: async (movieId: string) => {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`
    );
    return response.data.results;
  },

  searchMovies: async (query: string) => {
    const response = await axios.get(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    return response.data.results;
  },

  getMoviesByGenre: async (genreId: number) => {
    const response = await axios.get(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}`
    );
    return response.data.results;
  },

  // TV Show endpoints
  getTrendingTVShows: async () => {
    const response = await axios.get(
      `${TMDB_BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}`
    );
    return response.data.results;
  },

  getPopularTVShows: async () => {
    const response = await axios.get(
      `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}`
    );
    return response.data.results;
  },

  getTVShowDetails: async (showId: string) => {
    const response = await axios.get(
      `${TMDB_BASE_URL}/tv/${showId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,reviews`
    );
    return response.data;
  },

  getImageUrl: (path: string, size: 'w500' | 'original' = 'w500') => {
    return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : '/placeholder-poster.svg';
  },

  searchTVShows: async (query: string) => {
    const response = await axios.get(
      `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    return response.data.results;
  },

  getTVShowsByGenre: async (genreId: number) => {
    const response = await axios.get(
      `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=${genreId}`
    );
    return response.data.results;
  },

  getSimilarTVShows: async (showId: string) => {
    const response = await axios.get(
      `${TMDB_BASE_URL}/tv/${showId}/similar?api_key=${TMDB_API_KEY}`
    );
    return response.data.results;
  },
};

export const TMDB_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' }
]; 