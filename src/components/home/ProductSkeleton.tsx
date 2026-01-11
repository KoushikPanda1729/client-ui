export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative h-56 bg-gray-200 animate-pulse"></div>

      {/* Product Details Skeleton */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
        </div>

        {/* Category Badge Skeleton */}
        <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>

        {/* Price and Button Skeleton */}
        <div className="flex items-center justify-between pt-1 sm:pt-2">
          <div className="h-7 bg-gray-200 rounded animate-pulse w-16"></div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
