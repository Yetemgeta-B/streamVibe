import axios from 'axios';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  tagline?: string;
  status?: string;
  production_companies?: { id: number; name: string; logo_path: string | null }[];
  videos?: { results: MovieVideo[] };
  credits?: {
    cast: MovieCast[];
    crew: MovieCrew[];
  };
  streamingSources?: StreamingSource[];
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
}

export interface MovieCast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface MovieCrew {
  id: number;
  name: string;
  department: string;
  job: string;
  profile_path: string | null;
}

export interface StreamingSource {
  id: string;
  name: string;
  url: string;
  quality: string;
  isNative: boolean;
  baseUrl: string;
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'fallback_api_key';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Fallback movie data for development/demo purposes
const FALLBACK_MOVIES: Movie[] = [
  {
    id: 1,
    title: 'Sample Movie',
    overview: 'This is a sample movie description.',
    poster_path: '/placeholder.jpg',
    backdrop_path: '/placeholder-backdrop.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
    vote_count: 100,
    popularity: 500.5
  }
];

// Helper function to make API requests with error handling
const fetchFromApi = async (url: string, fallback: any = FALLBACK_MOVIES) => {
  try {
    const response = await axios.get(url, { timeout: 10000 }); // 10 second timeout
    return response.data;
  } catch (error) {
    console.error(`API request failed: ${url}`, error);
    return { results: fallback };
  }
};

export const tmdbApi = {
  // Get image URL with appropriate size
  getImageUrl: (path: string, size: 'w500' | 'original') => {
    if (!path) return ''; // Return empty string if path is null or undefined
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  // Get video thumbnail from YouTube or Vimeo
  getVideoThumbnail: (video: MovieVideo) => {
    if (video.site === 'YouTube') {
      return `https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`;
    } else if (video.site === 'Vimeo') {
      // For Vimeo, we would need to use their API to get the thumbnail
      // Returning a placeholder for now
      return `/images/placeholder-video.jpg`;
    }
    return `/images/placeholder-video.jpg`;
  },

  // Format movie runtime to hours and minutes
  formatRuntime: (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  },

  // Get trending movies for homepage
  getTrending: async (): Promise<Movie[]> => {
    try {
      const res = await fetch(
        `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=en-US`
      );

      if (!res.ok) {
        throw new Error('Failed to fetch trending movies');
      }

      const data = await res.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      return FALLBACK_MOVIES;
    }
  },

  // Get popular movies
  getPopular: async (): Promise<Movie[]> => {
    try {
      const res = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US`
      );

      if (!res.ok) {
        throw new Error('Failed to fetch popular movies');
      }

      const data = await res.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return FALLBACK_MOVIES;
    }
  },

  // Get now playing movies
  getNowPlaying: async (): Promise<Movie[]> => {
    try {
      const res = await fetch(
        `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US`
      );

      if (!res.ok) {
        throw new Error('Failed to fetch now playing movies');
      }

      const data = await res.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      return FALLBACK_MOVIES;
    }
  },

  // Get movie details by ID
  getMovieDetails: async (id: string): Promise<Movie> => {
    try {
      const res = await fetch(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos,credits`
      );

      if (!res.ok) {
        throw new Error('Failed to fetch movie details');
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error(`Error fetching movie details for ID ${id}:`, error);
      throw error; // Re-throw to handle in the calling function
    }
  },

  // Search for movies
  searchMovies: async (query: string): Promise<Movie[]> => {
    if (!query.trim()) return [];

    try {
      const res = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          query
        )}&include_adult=false`
      );

      if (!res.ok) {
        throw new Error('Failed to search movies');
      }

      const data = await res.json();
      return data.results;
    } catch (error) {
      console.error('Error searching movies:', error);
      return FALLBACK_MOVIES;
    }
  },

  // Get similar movies
  getSimilarMovies: async (id: string): Promise<Movie[]> => {
    try {
      const res = await fetch(
        `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=en-US`
      );

      if (!res.ok) {
        throw new Error('Failed to fetch similar movies');
      }

      const data = await res.json();
      return data.results;
    } catch (error) {
      console.error(`Error fetching similar movies for ID ${id}:`, error);
      return FALLBACK_MOVIES;
    }
  },

  // TV Show endpoints
  getTrendingTVShows: async () => {
    try {
      const data = await fetchFromApi(
        `${BASE_URL}/trending/tv/week?api_key=${API_KEY}`
      );
      return data.results;
    } catch (error) {
      console.error('Error fetching trending TV shows:', error);
      return FALLBACK_MOVIES;
    }
  },

  getPopularTVShows: async () => {
    try {
      const data = await fetchFromApi(
        `${BASE_URL}/tv/popular?api_key=${API_KEY}`
      );
      return data.results;
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      return FALLBACK_MOVIES;
    }
  },

  getTVShowDetails: async (showId: string) => {
    try {
      const data = await fetchFromApi(
        `${BASE_URL}/tv/${showId}?api_key=${API_KEY}&append_to_response=credits,videos,reviews`,
        FALLBACK_MOVIES[0]
      );
      return data;
    } catch (error) {
      console.error(`Error fetching TV show details for ID ${showId}:`, error);
      return FALLBACK_MOVIES[0];
    }
  },

  getMoviesByGenre: async (genreId: number): Promise<Movie[]> => {
    try {
      const res = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US`
      );

      if (!res.ok) {
        throw new Error('Failed to fetch movies by genre');
      }

      const data = await res.json();
      return data.results;
    } catch (error) {
      console.error(`Error fetching movies for genre ID ${genreId}:`, error);
      return FALLBACK_MOVIES;
    }
  },

  getTVShowsByGenre: async (genreId: number) => {
    try {
      const data = await fetchFromApi(
        `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}`
      );
      return data.results;
    } catch (error) {
      console.error(`Error fetching TV shows for genre ID ${genreId}:`, error);
      return FALLBACK_MOVIES;
    }
  },

  getSimilarTVShows: async (showId: string) => {
    try {
      const data = await fetchFromApi(
        `${BASE_URL}/tv/${showId}/similar?api_key=${API_KEY}`
      );
      return data.results;
    } catch (error) {
      console.error(`Error fetching similar TV shows for ID ${showId}:`, error);
      return FALLBACK_MOVIES;
    }
  },

  searchTVShows: async (query: string) => {
    try {
      const data = await fetchFromApi(
        `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
      );
      return data.results;
    } catch (error) {
      console.error(`Error searching TV shows for query "${query}":`, error);
      return FALLBACK_MOVIES;
    }
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