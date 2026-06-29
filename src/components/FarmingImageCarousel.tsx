'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface FarmingImageCarouselProps {
  height?: string;
  autoplay?: boolean;
  interval?: number;
}

const farmingImages = [
  {
    url: 'https://images.unsplash.com/photo-1592982551635-069e7b9a171d?q=80&w=1000&auto=format&fit=crop',
    caption: 'Organic Vegetable Farming',
    alt: 'Farmer harvesting organic vegetables'
  },
  {
    url: 'https://images.unsplash.com/photo-1623775435336-10c16d7f923d?q=80&w=1000&auto=format&fit=crop',
    caption: 'Sustainable Agriculture Practices',
    alt: 'Sustainable farming techniques in action'
  },
  {
    url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1000&auto=format&fit=crop',
    caption: 'Fresh Produce from Local Farms',
    alt: 'Fresh fruits and vegetables from local farms'
  },
  {
    url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop',
    caption: 'Supporting Local Farmers',
    alt: 'Farmer tending to crops'
  },
  {
    url: 'https://images.unsplash.com/photo-1599373670414-47663615fb41?q=80&w=1000&auto=format&fit=crop',
    caption: 'Farm-to-Table Movement',
    alt: 'Farm to table harvest'
  }
];

export default function FarmingImageCarousel({ 
  height = 'h-64',
  autoplay = true,
  interval = 5000 
}: FarmingImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoplay) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % farmingImages.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoplay, interval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? farmingImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % farmingImages.length;
    setCurrentIndex(newIndex);
  };

  return (
    <div className={`relative w-full ${height} overflow-hidden rounded-lg shadow-md`}>
      {farmingImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-xl font-bold">{image.caption}</h3>
          </div>
        </div>
      ))}
      
      {/* Navigation Arrows */}
      <button 
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {farmingImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 