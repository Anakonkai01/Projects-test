import React from 'react';

const SkeletonCard = () => (
  <div className="border border-gray-200 rounded-lg shadow-sm bg-white p-4">
    <div className="bg-gray-200 h-48 w-full rounded-md animate-pulse"></div>
    <div className="mt-4">
      <div className="bg-gray-200 h-6 w-3/4 rounded animate-pulse mb-3"></div>
      <div className="bg-gray-200 h-4 w-1/2 rounded animate-pulse"></div>
    </div>
  </div>
);

const ProductGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default ProductGridSkeleton;