const ProfileSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-pulse">
      
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-900 rounded-xl p-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-gray-700" />

        {/* Name & Email */}
        <div className="flex-1 space-y-3 w-full">
          <div className="h-5 bg-gray-700 rounded w-1/3" />
          <div className="h-4 bg-gray-700 rounded w-1/2" />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 bg-gray-900 rounded-xl p-4 space-y-3"
          >
            <div className="h-4 bg-gray-700 rounded w-1/2" />
            <div className="h-5 bg-gray-700 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSkeleton;
