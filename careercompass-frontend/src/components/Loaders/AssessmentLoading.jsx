const AssessmentLoading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <div className="relative mb-6">
        <div className="absolute inset-0 blur-2xl opacity-50
                        bg-gradient-to-r from-blue-500 to-purple-500" />
        <div className="relative z-10 text-2xl font-semibold">
          Career Compass
        </div>
      </div>

      <p className="text-gray-400 text-sm">
        Preparing your personalized assessment...
      </p>
    </div>
  );
};

export default AssessmentLoading;
