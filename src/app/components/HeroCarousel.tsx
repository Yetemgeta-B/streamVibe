'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlayIcon, InformationCircleIcon, ArrowLeftIcon, ArrowRightIcon, StarIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { Movie } from '../utils/tmdb';
import { tmdbApi } from '../utils/tmdb';
import { useRouter } from 'next/navigation';

export default function HeroCarousel({ featured }: { featured: Movie[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Check if viewport is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Auto-advance carousel with pause on hover
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!isTransitioning && !isHovered && carouselRef.current) {
      timer = setInterval(() => {
        nextSlide();
      }, 10000);
    }
    
    return () => clearInterval(timer);
  }, [currentSlide, isTransitioning, isHovered]);

  // Add touch support
  useEffect(() => {
    const carousel = carouselRef.current;
    
    if (!carousel) return;
    
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartX(e.touches[0].clientX);
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    };
    
    carousel.addEventListener('touchstart', handleTouchStart);
    carousel.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      carousel.removeEventListener('touchstart', handleTouchStart);
      carousel.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStartX]);

  // Simulate video being ready after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoReady(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setVideoReady(false);
    setCurrentSlide((prev) => (prev === featured.length - 1 ? 0 : prev + 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setVideoReady(false);
    setCurrentSlide((prev) => (prev === 0 ? featured.length - 1 : prev - 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
  };

  const handleIndicatorClick = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    
    setIsTransitioning(true);
    setVideoReady(false);
    setCurrentSlide(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
  };

  if (!featured || featured.length === 0) {
    return null;
  }

  const movie = featured[currentSlide];
  const formattedDate = new Date(movie.release_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getGenreName = (genreId: number) => {
    const genreMap: {[key: number]: string} = {
      28: 'Action',
      12: 'Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      14: 'Fantasy',
      36: 'History',
      27: 'Horror',
      10402: 'Music',
      9648: 'Mystery',
      10749: 'Romance',
      878: 'Science Fiction',
      10770: 'TV Movie',
      53: 'Thriller',
      10752: 'War',
      37: 'Western'
    };
    
    return genreMap[genreId] || '';
  };

  return (
    <section 
      ref={carouselRef}
      className="relative w-full h-[80vh] md:h-[85vh] lg:h-[90vh] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div 
          className={`absolute inset-0 transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
          style={{
            backgroundImage: `url(${tmdbApi.getImageUrl(movie.backdrop_path, 'original')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-transparent to-transparent"></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute -top-12 -left-12 w-56 h-56 bg-cyan-500/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -right-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Movie Poster (visible only on larger screens) */}
            <div className="hidden lg:block w-[26rem] 2xl:w-[30rem] shrink-0 mt-20">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)] transform transition-all duration-700 hover:scale-105">
                <Image
                  src={tmdbApi.getImageUrl(movie.poster_path, 'w500')}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1536px) 26rem, 30rem"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                
                {/* Rating badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/70 backdrop-blur-md text-white px-2 py-1 rounded-lg text-sm font-bold">
                  <StarIcon className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              </div>
            </div>
            
            {/* Movie Info */}
            <div className="w-full lg:max-w-3xl xl:max-w-4xl text-center lg:text-left">
              {/* Small poster for mobile */}
              <div className="lg:hidden relative w-48 h-72 mx-auto mb-4 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={tmdbApi.getImageUrl(movie.poster_path, 'w500')}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="12rem"
                  priority
                />
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-md text-white px-2 py-1 rounded-lg text-xs font-bold">
                  <StarIcon className="h-3 w-3 text-yellow-500" aria-hidden="true" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              </div>
              
              {/* Title with animated underline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-md">
                <span className="relative inline-block">
                  {movie.title}
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transform origin-left transition-transform duration-500 ease-out scale-x-0 group-hover:scale-x-100"></span>
                </span>
              </h1>
              
              {/* Movie metadata */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5 mb-6 text-sm sm:text-base text-gray-300">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1 text-cyan-400" aria-hidden="true" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1 text-cyan-400" aria-hidden="true" />
                  <span>120 min</span>
                </div>
                <div className="flex items-center gap-2">
                  {movie.genres?.slice(0, 3).map((genre, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-800/70 rounded-md text-xs">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Plot overview */}
              <p className="text-gray-300 mb-8 max-w-3xl mx-auto lg:mx-0 line-clamp-3 lg:line-clamp-4 text-sm sm:text-base leading-relaxed">
                {movie.overview}
              </p>
              
              {/* Call to action buttons - moved higher */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
                <Link
                  href={`/stream/${movie.id}`}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-bold text-lg flex items-center justify-center gap-2 transform transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                >
                  <PlayIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  Stream Now
                </Link>
                <Link
                  href={`/movies/${movie.id}`}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-800/70 hover:bg-gray-700/70 backdrop-blur-sm text-white rounded-lg font-medium flex items-center justify-center gap-2 border border-gray-700 transition-all duration-300 hover:border-gray-500"
                >
                  <InformationCircleIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                  More Details
                </Link>
              </div>
              
              {/* Stream providers display - added to enhance streaming focus */}
              <div className="hidden sm:flex items-center gap-3 mt-6">
                <span className="text-gray-400 text-sm">Available on:</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((provider) => (
                    <div key={provider} className="w-8 h-8 bg-gray-800 rounded-md flex items-center justify-center overflow-hidden">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500"></div>
                    </div>
                  ))}
                  <span className="text-xs text-gray-400">+3 more</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-0 inset-x-0 h-24 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {/* Custom Carousel Indicators */}
          <div className="hidden sm:flex items-center gap-2">
            {featured.map((_, index) => (
              <button
                key={index}
                onClick={() => handleIndicatorClick(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-10 bg-gradient-to-r from-cyan-400 to-blue-500' 
                    : 'w-2 bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={prevSlide}
            className="p-3 rounded-full bg-gray-900/80 backdrop-blur-sm text-white hover:bg-gray-800 transition-colors border border-gray-700 hover:border-gray-600"
            aria-label="Previous slide"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="p-3 rounded-full bg-gray-900/80 backdrop-blur-sm text-white hover:bg-gray-800 transition-colors border border-gray-700 hover:border-gray-600"
            aria-label="Next slide"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
} 