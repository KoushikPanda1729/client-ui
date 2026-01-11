export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Navbar Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <section className="bg-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <div className="h-12 w-3/4 bg-gray-200 animate-pulse rounded mb-4"></div>
              <div className="h-6 w-2/3 bg-gray-200 animate-pulse rounded mb-8"></div>
              <div className="h-12 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-md h-96 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section Skeleton */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="h-10 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 w-64 bg-gray-200 animate-pulse rounded"></div>
          </div>

          {/* Category Tabs Skeleton */}
          <div className="flex gap-6 mb-8 border-b border-gray-200 pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-56 bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="h-7 bg-gray-200 rounded animate-pulse w-16"></div>
                    <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
