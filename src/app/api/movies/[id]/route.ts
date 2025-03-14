import { NextResponse } from 'next/server';
import { tmdbApi } from '@/app/utils/tmdb';

// Define sources in order of preference
const STREAMING_SOURCES = [
  {
    id: 'tubi',
    name: 'Tubi',
    baseUrl: 'https://tubitv.com/movies/',
    availability: 0.7, // Probability of availability (for demo)
  },
  {
    id: 'pluto',
    name: 'PlutoTV',
    baseUrl: 'https://pluto.tv/on-demand/movies/',
    availability: 0.6,
  },
  {
    id: 'archive',
    name: 'Internet Archive',
    baseUrl: 'https://archive.org/details/',
    availability: 0.4,
  },
  {
    id: 'youtube',
    name: 'YouTube Free',
    baseUrl: 'https://www.youtube.com/watch?v=',
    availability: 0.5,
  },
  {
    id: 'plex',
    name: 'Plex Free',
    baseUrl: 'https://watch.plex.tv/movie/',
    availability: 0.65,
  }
];

// This is a mapping of external IDs to made-up streaming URLs
// In a real app, you would query actual streaming providers' APIs
const getStreamingSources = (movieId: string) => {
  // Generate deterministic but random-looking sources for demo purposes
  const seed = parseInt(movieId, 10);
  const random = (n: number) => ((seed * (n + 1)) % 100) / 100;
  
  return STREAMING_SOURCES.filter(source => {
    return random(STREAMING_SOURCES.indexOf(source)) < source.availability;
  }).map(source => {
    // Generate fake ID for this movie on the streaming service
    const serviceId = `${source.id}-${movieId}-${Math.floor(random(5) * 10000)}`;
    
    return {
      ...source,
      url: `${source.baseUrl}${serviceId}`,
      quality: random(3) > 0.6 ? 'HD' : (random(4) > 0.5 ? '4K' : 'SD'),
      isNative: random(6) > 0.5, // Whether it uses the native player or embedded
    };
  });
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure we have the ID and it's properly typed
    const movieId = params.id;
    
    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }
    
    // Get movie details from TMDB
    const movieData = await tmdbApi.getMovieDetails(movieId);
    
    // Add streaming sources
    const streamingSources = getStreamingSources(movieId);
    
    // Return enhanced data
    return NextResponse.json({
      ...movieData,
      streamingSources,
    });
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 }
    );
  }
} 