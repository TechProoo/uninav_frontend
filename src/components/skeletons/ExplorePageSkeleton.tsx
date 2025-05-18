import React from 'react';

const ExplorePageSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="mx-auto max-w-7xl">
        <div className="bg-white shadow-md mb-2 sm:mb-4 md:mb-6 p-2 sm:p-4 md:p-6 rounded-lg sm:rounded-xl">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-4">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="h-8 bg-gray-300 rounded w-24"></div>
          </div>

          {/* Tabs Skeleton */}
          <div className="w-full overflow-hidden">
            <div className="grid grid-cols-2 mb-3 sm:mb-4 md:mb-6 w-full h-max">
              <div className="bg-gray-300 rounded py-3 mx-1"></div>
              <div className="bg-gray-200 rounded py-3 mx-1"></div>
            </div>

            {/* Search and Filter Bar Skeleton */}
            <div className="flex flex-row gap-2 md:gap-4 items-center mb-4">
              <div className="relative flex-1 w-full h-10 sm:h-11 md:h-12 bg-gray-300 rounded-lg"></div>
              <div className="h-10 sm:h-11 md:h-12 bg-gray-300 rounded-lg w-24 md:w-32"></div>
              <div className="hidden md:flex h-10 sm:h-11 md:h-12 bg-gray-300 rounded-lg w-12"></div>
            </div>
            
            {/* Advanced Search Toggle Skeleton */}
            <div className="flex items-center space-x-2 mb-4">
                <div className="h-6 w-12 bg-gray-300 rounded-full"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>


            {/* Item Grid Skeleton - Repeat for a few items */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-gray-200 p-4 rounded-lg h-24">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePageSkeleton; 