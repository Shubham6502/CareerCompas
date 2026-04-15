import Card from "./Card";
import SectionLabel from "./SectionLabel.jsx";
//importing modal components
import EditProfileModal from '../modals/EditProfileModal.jsx';
import EditProfilePictureModal from '../modals/EditProfilePictureModal.jsx';
import {useState} from 'react';
import {Pencil,User,ExternalLink,UserRoundPen} from 'lucide-react';

export default function ProfileHeader({ data, onEdit, onShare,onImageSave ,isImageUploading}) {

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);
 
  const handleEditClick = () => {
    setIsEditModalOpen(true);
    // onEdit();
  };
  const handleSave=(updatedData)=>{
    onEdit(updatedData);
    setIsEditModalOpen(false);
  };
  const handleImageSave=(updatedData)=>{
    onImageSave(updatedData);
    setIsPictureModalOpen(false);
  };

  return (
      <>
    <Card className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
      {/* Avatar */}
      <div className="relative shrink-0"
      onClick={() => setIsPictureModalOpen(true)}
      >
          {isImageUploading ? (
            <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
          ) : (
              data.profilePicture? (<img
            src={data.profilePicture }
            alt={data.displayName}
            className="w-20 h-20 rounded-full object-cover ring-2"
            style={{ ringColor: "#58a6ff" }}
          />): (<User className="w-20 h-20 text-gray-400 border rounded-full p-3" />)
            
      )}
        <span
          className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
          style={{ backgroundColor: "#3fb950" }}
        >
          <Pencil className="w-3 h-3"  />
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h1
          className="text-2xl font-bold leading-tight"
          style={{ color: "var(--text-color)" }}
        >
          {data.displayName}
        </h1>
        <p
          className="text-sm mt-1 leading-relaxed"
          style={{ color: "var(--subText-color)" }}
        >
          {data.bio || "This user hasn't added a bio yet."}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          
            <span
              
              className="text-[10px] tracking-widest px-2 py-0.5 rounded"
              style={{
                color: "var(--subText-color)",
                backgroundColor: "rgba(88,166,255,0.08)",
                border: "1px solid rgba(88,166,255,0.15)",
              }}
            >
              {data.status || "No status set"}
            </span>
        
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleEditClick}
          className="px-4 py-1.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            backgroundColor: "rgba(139,148,158,0.15)",
            color: "var(--text-color)",
            border: "1px solid rgba(139,148,158,0.3)",
          }}
        >
          <UserRoundPen className="w-4 h-4" />
        </button>
        <button
          onClick={onShare}
          className="px-4  rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#58a6ff", color: "#0d1117" }}
        >
          <ExternalLink className="w-4 h-4 " />
        </button>
      </div>
      
    </Card>
     {isEditModalOpen && (
      <EditProfileModal
        profileData={data}
        onClose={() => setIsEditModalOpen(false)}
        onSave={updatedData => handleSave(updatedData)}       
      />
    )}

    {isPictureModalOpen && (
      <EditProfilePictureModal
        profileData={data}
        onClose={() => setIsPictureModalOpen(false)}
        onSave={(updatedData) => {
          handleImageSave(updatedData);
        }}
      />
    )}
    </>
   
  );
}