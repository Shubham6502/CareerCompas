import { useState } from "react";
import { Pencil, ExternalLink, UserRoundPen, User } from "lucide-react";
import { motion } from "framer-motion";
import EditProfileModal from "../modals/EditProfileModal.jsx";
import EditProfilePictureModal from "../modals/EditProfilePictureModal.jsx";

export default function ProfileHeader({ data = {}, onEdit, onShare, onImageSave, isImageUploading }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);

  const handleSave = (updatedData) => { onEdit(updatedData); setIsEditModalOpen(false); };
  const handleImageSave = (updatedData) => { onImageSave(updatedData); setIsPictureModalOpen(false); };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="card-color rounded-2xl border border-slate-100 dark:border-white/8 p-5 sm:p-6 relative overflow-hidden mb-5"
      >
        {/* Background glow */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-purple-500/8 blur-[60px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0 cursor-pointer" onClick={() => setIsPictureModalOpen(true)}>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-2 ring-indigo-500/40"
              style={{ boxShadow: "0 0 24px rgba(129,140,248,0.3)" }}>
              {isImageUploading ? (
                <div className="w-full h-full subcard-color animate-pulse rounded-2xl" />
              ) : data.profilePicture ? (
                <img src={data.profilePicture} alt={data.displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full subcard-color flex items-center justify-center">
                  <User size={36} className="subText-color" />
                </div>
              )}
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg bg-indigo-600 border-2 border-color flex items-center justify-center"
              style={{ boxShadow: "0 0 8px rgba(99,102,241,0.5)" }}>
              <Pencil size={10} className="text-white" />
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-color leading-tight">
                {data.displayName || "Your Name"}
              </h1>
              {data.status && (
                <span className="text-[10px] font-semibold tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  {data.status}
                </span>
              )}
            </div>
            <p className="text-[13px] subText-color leading-relaxed mb-3 max-w-lg">
              {data.bio || "No bio added yet. Click edit to add your bio."}
            </p>
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {(data.tags || ["SOFTWARE ENGINEER"]).map((tag) => (
                <span key={tag}
                  className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded subcard-color border border-slate-200 dark:border-white/10 subText-color">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl subcard-color border border-slate-200 dark:border-white/10 subText-color hover:text-color transition-colors text-[12px] font-medium">
              <UserRoundPen size={14} /> Edit
            </button>
            <button onClick={onShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-medium transition-colors"
              style={{ boxShadow: "0 0 12px rgba(99,102,241,0.35)" }}>
              <ExternalLink size={14} /> Share
            </button>
          </div>
        </div>
      </motion.div>

      {isEditModalOpen && (
        <EditProfileModal profileData={data} onClose={() => setIsEditModalOpen(false)} onSave={handleSave} />
      )}
      {isPictureModalOpen && (
        <EditProfilePictureModal profileData={data} onClose={() => setIsPictureModalOpen(false)}
          onSave={handleImageSave} />
      )}
    </>
  );
}