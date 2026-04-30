// components/profile/ProfileHeader.jsx
import Card from "../common/Card";

export default function ProfileHeader() {
  return (
    <Card className="bg-gradient-to-br from-[#0e0e1b] to-[#120f28]">
      <div className="flex items-center gap-4">
        
        {/* Avatar */}
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-white font-bold text-xl">
          SP
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Shubham Patil</h1>
          <p className="text-sm text-gray-400">Full Stack Developer · Pune</p>

          {/* Progress */}
          <div className="mt-2 w-full bg-gray-800 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full w-[83%]" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm border border-gray-700 rounded-lg text-white">
            Edit
          </button>
          <button className="px-3 py-1 text-sm bg-purple-600 rounded-lg text-white">
            Share
          </button>
        </div>
      </div>
    </Card>
  );
}