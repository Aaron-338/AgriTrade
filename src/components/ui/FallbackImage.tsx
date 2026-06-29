'use client';

import { useState } from 'react';
import Image from 'next/image';
import { unsplashService } from '@/lib/services/unsplashService';

interface FallbackImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

/**
 * FallbackImage component that handles image loading errors by providing fallback images
 * This is especially useful for external images that might not be available
 */
export default function FallbackImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [errorCount, setErrorCount] = useState<number>(0);

  const handleError = () => {
    if (errorCount === 0) {
      // First try - check if we have a known replacement for this URL
      setImgSrc(unsplashService.getReplacementImage(src));
      setErrorCount(1);
    } else if (errorCount === 1) {
      // Second try - use a random featured image
      const featuredImages = unsplashService.getCategoryImages('Featured', 1);
      setImgSrc(featuredImages[0]);
      setErrorCount(2);
    } else {
      // Last resort - use the fallback image
      setImgSrc(unsplashService.getFallbackImage());
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      priority={priority}
    />
  );
} 