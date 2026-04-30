import { CloudUpload } from "lucide-react";

export default function ResourcesHeader({ onUpload }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 pt-1">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-color">
          Resources
        </h1>
        <p className="subText-color text-sm mt-1">
          Discover, share, and upvote learning materials.
        </p>
      </div>

      <button
        onClick={onUpload}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white transition-all duration-200 px-5 py-2.5 rounded-xl font-medium text-sm shadow-lg shadow-blue-600/20 shrink-0"
      >
        <CloudUpload size={16} />
        Upload Resource
      </button>
    </div>
  );
}
