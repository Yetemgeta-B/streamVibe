'use client';

import { useState, useEffect, useRef } from 'react';
import { StreamingSource } from '@/app/utils/tmdb';
import { XMarkIcon, SpeakerWaveIcon, SpeakerXMarkIcon, ArrowsPointingOutIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/outline';

interface VideoPlayerProps {
  source: StreamingSource;
  title: string;
  poster?: string;
  onError?: () => void;
  onReady?: () => void;
}

export default function VideoPlayer({ source, title, poster, onError, onReady }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Handle iframe or native player decision based on source
  const isIframeSource = !source.isNative || source.id === 'youtube' || source.id === 'archive' || source.id === 'pluto';

  // Format time in MM:SS format
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle URL mapping for different streaming sources
  const getSourceUrl = () => {
    // For YouTube, we need to transform the URL to embed format
    if (source.id === 'youtube' && source.url.includes('youtube.com/watch?v=')) {
      const videoId = source.url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`;
    }
    
    // For YouTube, handle shorts format
    if (source.id === 'youtube' && source.url.includes('youtube.com/shorts/')) {
      const videoId = source.url.split('/shorts/')[1]?.split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`;
    }
    
    // For Internet Archive, we'll use their embed format
    if (source.id === 'archive') {
      const archiveId = source.url.split('/details/')[1]?.split('?')[0] || source.url;
      return `https://archive.org/embed/${archiveId}`;
    }
    
    // For Pluto TV, we'll use their embed format
    if (source.id === 'pluto') {
      return `${source.url}?autoplay=true`;
    }
    
    // For Tubi, embed format
    if (source.id === 'tubi') {
      const tubiId = source.url.split('/movies/')[1]?.split('?')[0] || source.url;
      return `https://tubitv.com/embed/${tubiId}?autoplay=true`;
    }
    
    // For Plex free movies
    if (source.id === 'plex') {
      const plexId = source.url.split('/movie/')[1]?.split('?')[0] || source.url;
      return `https://watch.plex.tv/embed/${plexId}?autoplay=1`;
    }
    
    // Default case - just return the URL
    return source.url;
  };

  // For demo purposes, we'll use a fallback video for the native player
  const getNativeVideoUrl = () => {
    // These would normally come from your backend API based on the movie
    const fallbackVideoSources = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    ];
    
    // Use the movie ID to deterministically pick a fallback
    const index = parseInt(source.url.split('-').pop() || '0', 10) % fallbackVideoSources.length;
    return fallbackVideoSources[index];
  };

  // Show/hide controls on mouse move and touch
  useEffect(() => {
    const handleMouseMove = () => {
      setIsControlsVisible(true);
      
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
      
      if (isPlaying) {
        controlsTimerRef.current = setTimeout(() => {
          setIsControlsVisible(false);
        }, 3000);
      }
    };
    
    const container = playerContainerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseMove);
      container.addEventListener('touchstart', handleMouseMove);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseMove);
        container.removeEventListener('touchstart', handleMouseMove);
      }
      
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, [isPlaying]);

  // Update time while playing
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isIframeSource) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    
    const handleDurationChange = () => {
      setDuration(video.duration);
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    const handleWaiting = () => {
      setIsBuffering(true);
    };
    
    const handlePlaying = () => {
      setIsBuffering(false);
      if (onReady) onReady();
    };
    
    const handleError = () => {
      setLoadError(true);
      if (onError) onError();
    };
    
    const handleCanPlay = () => {
      setIsBuffering(false);
      if (onReady) onReady();
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [isIframeSource, onError, onReady]);

  // Handle iframe loaded event
  useEffect(() => {
    if (isIframeSource) {
      // Simulate iframe loading for demo purposes
      const loadingTimer = setTimeout(() => {
        setIsBuffering(false);
        if (onReady) onReady();
      }, 2000);
      
      return () => clearTimeout(loadingTimer);
    }
  }, [isIframeSource, onReady]);

  // Handle play/pause toggle
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || isIframeSource) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((error) => {
        console.error('Error playing video:', error);
        setLoadError(true);
        if (onError) onError();
      });
    }
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    const container = playerContainerRef.current;
    if (!container) return;
    
    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch((error) => {
          console.error('Error entering fullscreen:', error);
        });
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((error) => {
          console.error('Error exiting fullscreen:', error);
        });
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  // Handle playback rate change
  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    
    const video = videoRef.current;
    if (video && !isIframeSource) {
      video.playbackRate = rate;
    }
  };

  // Double tap to seek
  const handleDoubleTap = (isRightSide: boolean) => {
    const video = videoRef.current;
    if (!video || isIframeSource) return;
    
    const seekAmount = 10; // 10 seconds
    
    if (isRightSide) {
      video.currentTime = Math.min(video.currentTime + seekAmount, video.duration);
    } else {
      video.currentTime = Math.max(video.currentTime - seekAmount, 0);
    }
    
    setCurrentTime(video.currentTime);
  };

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isIframeSource) return;
    
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
  };

  // Handle touch move for seeking
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isIframeSource) return;
    
    const video = videoRef.current;
    if (!video) return;
    
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartX;
    const diffY = touch.clientY - touchStartY;
    
    // Only handle horizontal swipes (for seeking)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      setIsSeeking(true);
      
      // Calculate new time: 0.5 second per 10 pixels
      const newTime = Math.max(0, Math.min(video.duration, currentTime + (diffX * 0.05)));
      setCurrentTime(newTime);
      video.currentTime = newTime;
      
      setTouchStartX(touch.clientX);
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    setIsSeeking(false);
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    const video = videoRef.current;
    if (video && !isIframeSource) {
      video.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video || isIframeSource) return;
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (newMutedState) {
      video.muted = true;
    } else {
      video.muted = false;
      video.volume = volume;
    }
  };

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    
    const video = videoRef.current;
    if (video && !isIframeSource) {
      video.currentTime = seekTime;
    }
  };

  if (isIframeSource) {
    return (
      <div 
        ref={playerContainerRef}
        className="relative aspect-video bg-black w-full overflow-hidden"
      >
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
            <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <iframe 
          src={getSourceUrl()}
          title={title}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={() => setIsBuffering(false)}
        ></iframe>
        
        {/* Source label */}
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium">
          {source.name} {source.quality}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={playerContainerRef}
      className="relative aspect-video bg-black w-full overflow-hidden group"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full h-full"
        poster={poster}
        onClick={togglePlay}
        autoPlay
        playsInline
      >
        <source src={getNativeVideoUrl()} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Loading indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Play/pause overlay */}
      {!isBuffering && !isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer z-10"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transform transition-transform hover:scale-110">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <PlayIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      )}
      
      {/* Error overlay */}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <div className="max-w-md p-6 bg-gray-800 rounded-lg text-center">
            <div className="text-yellow-500 text-4xl mb-3">⚠️</div>
            <h3 className="text-white text-lg font-medium mb-2">Playback Error</h3>
            <p className="text-gray-400 mb-4">We're unable to play this content. Please try a different source.</p>
          </div>
        </div>
      )}
      
      {/* Source label */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium">
        {source.name} {source.quality}
              </div>
              
      {/* Seeking indicator */}
      {isSeeking && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-md font-medium z-20">
          {formatTime(currentTime)}
                </div>
      )}
      
      {/* Controls - show on hover or when paused */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 z-10 ${
          isControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress bar */}
        <div className="flex items-center mb-4">
          <input 
            type="range" 
            min="0" 
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
          />
                </div>
                
        {/* Controls bar */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Play/pause button */}
                <button
              onClick={togglePlay}
              className="text-white hover:text-blue-500 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <PauseIcon className="h-6 w-6" />
              ) : (
                <PlayIcon className="h-6 w-6" />
                  )}
                </button>
            
            {/* Time display */}
            <div className="text-white text-sm hidden sm:block">
              {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            
            {/* Mobile-friendly time display */}
            <div className="text-white text-xs sm:hidden">
              {formatTime(currentTime)}
            </div>
            
            {/* Volume control */}
            <div className="hidden sm:flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-blue-500 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <SpeakerXMarkIcon className="h-5 w-5" />
                ) : (
                  <SpeakerWaveIcon className="h-5 w-5" />
                )}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1.5 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
              />
            </div>
          </div>
          
          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Playback speed - desktop only */}
            <div className="hidden sm:block relative">
              <button
                className="text-white hover:text-blue-500 transition-colors text-sm font-medium"
                onClick={() => document.getElementById('speed-menu')?.classList.toggle('hidden')}
              >
                {playbackRate}x
              </button>
              <div 
                id="speed-menu" 
                className="hidden absolute bottom-full right-0 mb-2 bg-gray-800 rounded-md shadow-lg z-30 border border-gray-700"
              >
                <div className="py-1">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                    <button
                      key={rate}
                      className={`block w-full text-left px-4 py-1 text-sm ${
                        rate === playbackRate ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                      }`}
                      onClick={() => {
                        changePlaybackRate(rate);
                        document.getElementById('speed-menu')?.classList.add('hidden');
                      }}
                    >
                      {rate}x
                      </button>
                    ))}
                  </div>
                </div>
            </div>
            
            {/* Fullscreen button */}
            <button 
              onClick={toggleFullscreen}
              className="text-white hover:text-blue-500 transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              <ArrowsPointingOutIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Touch controls overlay for seeking (invisible but handles double tap) */}
      <div className="absolute inset-0 flex z-0">
        <div 
          className="w-1/2 h-full" 
          onDoubleClick={() => handleDoubleTap(false)}
        />
        <div 
          className="w-1/2 h-full" 
          onDoubleClick={() => handleDoubleTap(true)}
        />
        </div>
    </div>
  );
} 
