'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface FarmingTipsCarouselProps {
  height?: string;
  autoplay?: boolean;
  interval?: number;
}

const farmingTips = [
  {
    title: 'Sustainable Farming Practices',
    tip: 'Use crop rotation to maintain soil health and reduce the need for chemical fertilizers.',
    imageUrl: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=1000&auto=format&fit=crop',
    alt: 'Sustainable farming field',
  },
  {
    title: 'Water Conservation',
    tip: 'Implement drip irrigation systems to reduce water usage while ensuring your crops get the moisture they need.',
    imageUrl: 'https://images.unsplash.com/photo-1559513455-6939c0ff490d?q=80&w=1000&auto=format&fit=crop',
    alt: 'Irrigation system in a farm',
  },
  {
    title: 'Natural Pest Control',
    tip: 'Plant companion crops that naturally repel harmful insects and attract beneficial ones.',
    imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1000&auto=format&fit=crop',
    alt: 'Natural pest control techniques',
  },
  {
    title: 'Optimal Harvesting Timing',
    tip: 'Harvest vegetables early in the morning when they are at their freshest and most nutrient-dense.',
    imageUrl: 'https://images.unsplash.com/photo-1598886221321-20a7c72905b9?q=80&w=1000&auto=format&fit=crop',
    alt: 'Farmer harvesting vegetables',
  },
  {
    title: 'Soil Health Management',
    tip: 'Test your soil regularly and add organic matter to maintain optimal pH and nutrient levels.',
    imageUrl: 'https://images.unsplash.com/photo-1599168998034-9748920bc6be?q=80&w=1000&auto=format&fit=crop',
    alt: 'Healthy soil in hands',
  }
];

export default function FarmingTipsCarousel({ 
  height = 'h-64',
  autoplay = true,
  interval = 7000 
}: FarmingTipsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoplay) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % farmingTips.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoplay, interval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? farmingTips.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % farmingTips.length;
    setCurrentIndex(newIndex);
  };

  return (
    <div className={`relative w-full ${height} overflow-hidden rounded-lg shadow-md`}>
      {farmingTips.map((tip, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={tip.imageUrl}
            alt={tip.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-xl font-bold mb-2">{tip.title}</h3>
            <p className="text-sm md:text-base">{tip.tip}</p>
          </div>
        </div>
      ))}
      
      {/* Navigation Arrows */}
      <button 
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
        aria-label="Previous tip"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
        aria-label="Next tip"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {farmingTips.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to tip ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 