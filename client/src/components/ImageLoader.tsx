import { useState } from "react";

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageLoader({ src, alt, className = "" }: ImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <img
          src="/assets/images/placeholders/loading.svg"
          alt="Loading..."
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          setHasError(true);
          setIsLoading(false);
          const target = e.target as HTMLImageElement;
          target.src = '/assets/images/placeholders/no-image.svg';
        }}
      />
    </div>
  );
}
