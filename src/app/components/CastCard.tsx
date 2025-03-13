import Image from 'next/image';

interface CastCardProps {
  name: string;
  character: string;
  profilePath: string;
}

export default function CastCard({ name, character, profilePath }: CastCardProps) {
  return (
    <div className="flex-shrink-0 w-32">
      <div className="rounded-lg overflow-hidden">
        <Image
          src={profilePath}
          alt={name}
          width={128}
          height={192}
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="mt-2">
        <h3 className="font-medium text-sm truncate">{name}</h3>
        <p className="text-gray-400 text-xs truncate">{character}</p>
      </div>
    </div>
  );
} 