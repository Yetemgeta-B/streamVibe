'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PlayIcon, InformationCircleIcon, HeartIcon, ShareIcon, ChevronDownIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon } from '@heroicons/react/24/solid';
import { tmdbApi, type Movie } from '@/app/utils/tmdb';
// Import the custom video player
import VideoPlayer from '@/app/components/VideoPlayer';

// Free streaming sources we'll integrate
const STREAMING_SOURCES = [
  {
    id: 'tubi',
    name: 'Tubi',
    icon: '🔴',
    color: 'bg-red-600',
    description: 'Free, ad-supported streaming service with thousands of movies and TV shows',
  },
  {
    id: 'pluto',
    name: 'PlutoTV',
    icon: '🟡',
    color: 'bg-yellow-500',
    description: 'Free streaming service with over 250+ live channels and on-demand movies',
  },
  {
    id: 'archive',
    name: 'Internet Archive',
    icon: '🟢',
    color: 'bg-green-600',
    description: 'Digital library with free access to movies, books, music, and more',
  },
  {
    id: 'youtube',
    name: 'YouTube Free',
    icon: '🔴',
    color: 'bg-red-500',
    description: 'Free movies and shows available on YouTube (ad-supported)',
  },
  {
    id: 'plex',
    name: 'Plex Free',
    icon: '🟠',
    color: 'bg-orange-500',
    description: 'Free, ad-supported movies and shows from Plex streaming service',
  }
];

export default function MovieStreamPage({ params }: { params: { id: string } }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSource, setSelectedSource] = useState(STREAMING_SOURCES[0].id);
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);
  const [isLoadingStream, setIsLoadingStream] = useState(true);
  const [adOverlay, setAdOverlay] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const router = useRouter();

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        setError('');
        
        // For demo purposes we'll use the TMDB API to get movie details
        // In a real implementation, you would fetch from your backend where you'd
        // aggregate multiple streaming sources
        const response = await fetch(`/api/movies/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError('Failed to load the movie. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovie();
  }, [params.id]);

  // Check if movie is in favorites
  useEffect(() => {
    if (!movie) return;
    
    // In a real app, you would get this from your backend user preferences
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      const parsedFavorites = JSON.parse(savedFavorites);
      setFavorites(parsedFavorites);
      setIsFavorite(parsedFavorites.includes(movie.id.toString()));
    }
  }, [movie]);

  // Simulate player loading - we'll replace this with actual player state tracking
  useEffect(() => {
    if (!movie) return;
    
    setIsLoadingStream(true);
    
    // Show loading state briefly for UX clarity
    const timer = setTimeout(() => {
      setIsLoadingStream(false);
      setIsPlayerLoaded(true);
      
      // Only show ad if not in error state
      if (!streamError) {
        // Simulate an ad appearing shortly after loading
        setTimeout(() => {
          setAdOverlay(true);
          
          // Auto-dismiss the ad after a few seconds
          setTimeout(() => {
            setAdOverlay(false);
          }, 5000);
        }, 3000);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [movie, selectedSource, streamError]);

  // Handle favorite toggle
  const toggleFavorite = () => {
    if (!movie) return;
    
    const movieId = movie.id.toString();
    let updatedFavorites: string[];
    
    if (isFavorite) {
      updatedFavorites = favorites.filter(id => id !== movieId);
    } else {
      updatedFavorites = [...favorites, movieId];
    }
    
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
    setIsFavorite(!isFavorite);
  };

  // Handle source change
  const changeSource = (sourceId: string) => {
    setSelectedSource(sourceId);
    setIsPlayerLoaded(false);
    setStreamError(false);
  };

  // Report error
  const reportStreamError = () => {
    setStreamError(true);
    // In a real app, you would send this to your backend
    console.log('Stream error reported for movie:', movie?.id, 'source:', selectedSource);
  };

  // Get current source object
  const getCurrentSource = () => {
    if (!movie?.streamingSources) return null;
    return movie.streamingSources.find(source => source.id === selectedSource);
  };

  // Handle error from video player
  const handlePlayerError = () => {
    setStreamError(true);
  };

  // Handle ad dismissal
  const dismissAd = () => {
    setAdOverlay(false);
  };

  // Handle player ready state
  const handlePlayerReady = () => {
    setIsLoadingStream(false);
    setIsPlayerLoaded(true);
    
    // Reset error state when player is ready
    setStreamError(false);
    
    // Only show ad if not in error state
    if (!streamError) {
      // Simulate an ad appearing shortly after loading
      setTimeout(() => {
        setAdOverlay(true);
        
        // Auto-dismiss the ad after a few seconds
        setTimeout(() => {
          setAdOverlay(false);
        }, 5000);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-lg">Loading movie stream...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 text-center">
          <div className="text-red-500 text-5xl mb-4">😞</div>
          <h1 className="text-xl text-white font-bold mb-2">Unable to Stream</h1>
          <p className="text-gray-400 mb-6">{error || 'The requested movie is not available for streaming.'}</p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const currentSource = getCurrentSource();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Movie backdrop header */}
      <div className="relative w-full h-[30vh] md:h-[40vh]">
        <div className="absolute inset-0 z-0">
          {movie.backdrop_path && (
            <Image
              src={tmdbApi.getImageUrl(movie.backdrop_path, 'original')}
              alt={movie.title}
              fill
              className="object-cover opacity-40"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-end">
          <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
            <div className="hidden md:block w-36 h-52 rounded-lg overflow-hidden shadow-xl">
              {movie.poster_path ? (
                <Image
                  src={tmdbApi.getImageUrl(movie.poster_path, 'w500')}
                  alt={movie.title}
                  width={144}
                  height={216}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-600">No Image</span>
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">{movie.title}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-gray-400">
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                  {movie.vote_average?.toFixed(1)}
                </span>
                <span>{movie.runtime} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video player column */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl">
              {/* Player header */}
              <div className="bg-gray-700 p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <h2 className="text-white font-medium">Watch: {movie.title}</h2>
                  <div className="flex items-center">
                    <div className="relative">
                      <button 
                        className="text-gray-300 hover:text-white flex items-center space-x-1 text-sm"
                        onClick={() => document.getElementById('source-dropdown')?.classList.toggle('hidden')}
                      >
                        <span>Source: {STREAMING_SOURCES.find(s => s.id === selectedSource)?.name}</span>
                        <ChevronDownIcon className="h-4 w-4" />
                      </button>
                      
                      {/* Dropdown menu */}
                      <div id="source-dropdown" className="hidden absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-50">
                        <div className="py-1">
                          {movie.streamingSources?.map(source => (
                            <button
                              key={source.id}
                              className={`flex items-center px-4 py-2 text-sm w-full text-left ${selectedSource === source.id ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                              onClick={() => {
                                changeSource(source.id);
                                document.getElementById('source-dropdown')?.classList.add('hidden');
                              }}
                            >
                              <span className="mr-2">{STREAMING_SOURCES.find(s => s.id === source.id)?.icon}</span>
                              {source.name} ({source.quality})
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleFavorite}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFavorite ? (
                      <HeartIconSolid className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    className="text-gray-300 hover:text-blue-500 transition-colors p-1"
                    aria-label="Share movie"
                  >
                    <ShareIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Player area */}
              <div className="relative aspect-video bg-black">
                {isLoadingStream && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-20">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400">Loading stream from {STREAMING_SOURCES.find(s => s.id === selectedSource)?.name}...</p>
                    <p className="text-xs text-gray-500 mt-2">Please wait while we connect to the streaming server</p>
                  </div>
                )}
                
                {/* Use our custom video player */}
                {isPlayerLoaded && !isLoadingStream && !streamError && currentSource && (
                  <VideoPlayer 
                    source={currentSource}
                    title={movie.title}
                    poster={movie.backdrop_path ? tmdbApi.getImageUrl(movie.backdrop_path, 'original') : undefined}
                    onError={handlePlayerError}
                  />
                )}
                
                {/* Ad overlay - enhanced with better styling */}
                {adOverlay && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                    <div className="max-w-md p-4 bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Advertisement</span>
                        <button className="text-gray-400 hover:text-white transition-colors" onClick={dismissAd}>
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="aspect-video bg-gray-700 flex items-center justify-center mb-3 rounded overflow-hidden">
                        <div className="text-center p-4">
                          <p className="text-lg text-white font-bold mb-2">Enjoy ad-free streaming</p>
                          <p className="text-sm text-gray-300 mb-4">Upgrade to StreamVibe Premium to remove ads and unlock all content</p>
                          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-md text-white text-sm font-medium transition-all transform hover:scale-105">
                            Upgrade Now
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400">Ad will close in <span className="font-medium">5</span> seconds</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Stream error message - enhanced with more options */}
                {streamError && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-30">
                    <div className="max-w-md p-6 bg-gray-800 rounded-lg text-center border border-gray-700">
                      <div className="text-yellow-500 text-4xl mb-3">⚠️</div>
                      <h3 className="text-white text-lg font-bold mb-2">Playback Issue</h3>
                      <p className="text-gray-400 mb-4">We're having trouble playing this content from the current source.</p>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {movie.streamingSources?.filter(s => s.id !== selectedSource).slice(0, 4).map(source => (
                          <button
                            key={source.id}
                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-sm flex flex-col items-center transition-colors"
                            onClick={() => changeSource(source.id)}
                          >
                            <span className="text-lg mb-1">{STREAMING_SOURCES.find(s => s.id === source.id)?.icon}</span>
                            {source.name}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button 
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium transition-colors"
                          onClick={() => setStreamError(false)}
                        >
                          Try Again
                        </button>
                        <button 
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-sm font-medium transition-colors"
                          onClick={() => router.push('/')}
                        >
                          Back to Home
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Player controls - enhanced with more options */}
              <div className="p-4 flex flex-wrap gap-2 justify-between items-center bg-gray-800 border-t border-gray-700">
                <div className="flex flex-wrap gap-2">
                  <button 
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium flex items-center transition-colors"
                    onClick={() => setIsLoadingStream(false)}
                  >
                    <PlayIcon className="h-4 w-4 mr-1" />
                    Resume
                  </button>
                  <button 
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-sm font-medium flex items-center transition-colors"
                    onClick={() => {
                      setIsLoadingStream(true);
                      setTimeout(() => setIsLoadingStream(false), 1000);
                    }}
                  >
                    <ArrowPathIcon className="h-4 w-4 mr-1" />
                    Refresh
                  </button>
                  <div className="relative inline-block">
                    <button 
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-sm font-medium flex items-center transition-colors"
                      onClick={() => document.getElementById('quality-dropdown')?.classList.toggle('hidden')}
                    >
                      <span>Quality: {currentSource?.quality || 'Auto'}</span>
                      <ChevronDownIcon className="h-4 w-4 ml-1" />
                    </button>
                    <div id="quality-dropdown" className="hidden absolute top-full left-0 mt-1 w-32 bg-gray-800 rounded-md shadow-lg z-20 border border-gray-700">
                      <div className="py-1">
                        {['Auto', 'HD', '4K', 'SD'].map((quality) => (
                          <button
                            key={quality}
                            className="block w-full text-left px-4 py-1.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                          >
                            {quality}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={reportStreamError}
                    className="text-gray-400 hover:text-gray-300 text-xs transition-colors"
                  >
                    Report Playback Issue
                  </button>
                  <button
                    className="text-gray-400 hover:text-gray-300 text-xs transition-colors"
                  >
                    Help & Support
                  </button>
                </div>
              </div>
            </div>
            
            {/* Streaming sources - enhanced with descriptions */}
            <div className="mt-6 bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-medium text-lg mb-4 flex items-center">
                <span className="mr-2">📺</span> Available Streaming Sources
              </h3>
              {movie.streamingSources && movie.streamingSources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {movie.streamingSources.map(source => {
                    const sourceInfo = STREAMING_SOURCES.find(s => s.id === source.id);
                    return (
                      <button
                        key={source.id}
                        className={`flex flex-col p-4 rounded-lg border transition-all ${
                          selectedSource === source.id 
                            ? 'border-blue-500 bg-blue-900/20' 
                            : 'border-gray-700 bg-gray-700/30 hover:bg-gray-700/60'
                        }`}
                        onClick={() => changeSource(source.id)}
                      >
                        <div className="flex items-center mb-2">
                          <div className={`w-8 h-8 ${sourceInfo?.color || 'bg-gray-700'} rounded-full flex items-center justify-center text-lg mr-2`}>
                            {sourceInfo?.icon || '📺'}
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-200">{source.name}</span>
                            <span className="text-xs text-gray-400 ml-2">{source.quality}</span>
                          </div>
                          {selectedSource === source.id && (
                            <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">Active</span>
                          )}
                        </div>
                        {sourceInfo?.description && (
                          <p className="text-xs text-gray-400 mt-1">{sourceInfo.description}</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-gray-400 text-sm">No streaming sources are available for this title.</p>
                </div>
              )}
              <div className="mt-4 text-xs text-gray-500">
                <p>Note: These are free, ad-supported streaming sources. Stream quality and availability may vary by region.</p>
              </div>
            </div>
            
            {/* Movie description */}
            <div className="mt-6 bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl text-white font-medium mb-2">About {movie.title}</h2>
              <p className="text-gray-300 mb-4">{movie.overview}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="text-gray-500 mb-1">Release Date</h4>
                  <p className="text-white">{new Date(movie.release_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <h4 className="text-gray-500 mb-1">Runtime</h4>
                  <p className="text-white">{movie.runtime} minutes</p>
                </div>
                <div>
                  <h4 className="text-gray-500 mb-1">Rating</h4>
                  <p className="text-white">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10</p>
                </div>
                {movie.tagline && (
                  <div className="col-span-full">
                    <h4 className="text-gray-500 mb-1">Tagline</h4>
                    <p className="text-white italic">"{movie.tagline}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Similar movies */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl mb-6">
              <h3 className="text-lg text-white font-medium mb-4">Similar Movies</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-16 h-24 bg-gray-700 rounded-md flex-shrink-0 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium line-clamp-1">Similar Movie {i + 1}</h4>
                      <p className="text-gray-400 text-sm">2023 • Action, Drama</p>
                      <div className="mt-2">
                        <button className="text-xs text-blue-400 hover:text-blue-300">
                          Watch Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button className="text-sm text-blue-400 hover:text-blue-300">
                  View More
                </button>
              </div>
            </div>
            
            {/* Server status */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <h3 className="text-lg text-white font-medium mb-4">Streaming Server Status</h3>
              <div className="space-y-3">
                {STREAMING_SOURCES.map(source => (
                  <div key={source.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 ${source.color} rounded-full flex items-center justify-center text-xs`}>
                        {source.icon}
                      </div>
                      <span className="text-gray-300 text-sm">{source.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      <span className="text-gray-400 text-xs">Online</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-300">Server performance may impact streaming quality. If you experience issues, try switching to another source.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 