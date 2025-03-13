import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';

interface ReviewCardProps {
  author: string;
  content: string;
  rating?: number;
  avatar: string;
  date: string;
}

export default function ReviewCard({ author, content, rating, avatar, date }: ReviewCardProps) {
  // Limit content length for preview
  const truncatedContent = content.length > 300 
    ? content.substring(0, 300) + '...' 
    : content;

  return (
    <div className="bg-gray-800/50 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={avatar}
              alt={author}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">{author}</h3>
            <span className="text-gray-400 text-sm">{date}</span>
          </div>
          
          {rating !== undefined && (
            <div className="flex items-center mb-3">
              <StarIcon className="h-5 w-5 text-yellow-500 mr-1" />
              <span className="font-medium">{rating.toFixed(1)}/10</span>
            </div>
          )}
          
          <p className="text-gray-300 text-sm whitespace-pre-line">{truncatedContent}</p>
        </div>
      </div>
    </div>
  );
} 