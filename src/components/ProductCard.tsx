'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
  farmer: {
    id: string;
    name: string;
    location: string;
    rating: number;
  };
  category: string;
  createdAt: string;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  unit,
  quantity,
  image,
  farmer,
  category,
  createdAt
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  // Format the date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 w-full bg-gray-200">
        {/* Fallback for images */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          {!image || imgError ? (
            <div className="text-center">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-1 text-sm">{name}</p>
            </div>
          ) : null}
        </div>
        
        {image && !imgError && (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            onError={() => setImgError(true)}
          />
        )}
        
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
          {category}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold">{name}</h3>
          <div className="text-green-600 font-bold">${price.toFixed(2)}/{unit}</div>
        </div>
        
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>
        
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{farmer.location}</span>
        </div>
        
        <div className="mt-1 flex items-center text-sm text-gray-500">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Posted on {formattedDate}</span>
        </div>
        
        <div className="mt-3 flex items-center">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{farmer.name}</span>
          </div>
          <div className="ml-auto flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`h-4 w-4 ${
                    i < farmer.rating ? 'text-yellow-400' : 'text-gray-300'
                  } fill-current`} 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Available: </span>
            <span>{quantity} {unit}</span>
          </div>
          <Link href={`/product/${id}`} className="btn-primary text-sm py-1">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
} 