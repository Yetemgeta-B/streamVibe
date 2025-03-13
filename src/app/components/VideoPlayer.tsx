'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

interface VideoPlayerProps {
  videoId: string;
}

export default function VideoPlayer({ videoId }: VideoPlayerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="bg-gray-900 aspect-w-16 aspect-h-9 animate-pulse rounded-lg"></div>;

  return (
    <div className="relative rounded-lg overflow-hidden">
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${videoId}`}
        width="100%"
        height="100%"
        controls
        playing={false}
        light={false}
        pip={true}
        config={{
          youtube: {
            playerVars: {
              modestbranding: 1,
              rel: 0,
            },
          },
        }}
      />
    </div>
  );
} 