import { useState } from "react";
// import EditProfilePictureModal from "./EditProfilePictureModal.jsx";
const EditProfileModal = ({ profileData, onClose, onSave }) => {
  console.log("EditProfileModal received profileData:", profileData);
  const [formData, setFormData] = useState({
    ...profileData,
    displayName: profileData.displayName || "",
    bio: profileData.bio || "",
    status: profileData.status || "",

  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [showPictureModal, setShowPictureModal] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log("Submitting form data:", formData);
    setIsSaving(true);
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100  h-full">
      <div className="card-color rounded-xl p-6 md:w-full max-w-md space-y-4">
        
        <h3 className="text-lg font-semibold text-color">
          Edit Profile
        </h3>

       
        <label className="block text-sm font-medium text-color">Name</label>
        <input
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          placeholder="Name"
          className="w-full subcard-color text-color rounded-lg px-4 py-2 outline-none"
        />
         

        <label className="block text-sm font-medium text-color">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Bio"
          rows={3}
          className="w-full subcard-color text-color rounded-lg px-4 py-2 outline-none resize-none"
        />
        <label className="block text-sm font-medium text-color ">Status</label>
        <select name="status" id="status" className="text-color card-color w-full rounded-lg px-4 py-2 outline-none"  value={formData.status} onChange={handleChange}>
          <option value="open to work">open to work</option>
          <option value="actively looking">Actively Looking</option>
          <option value="not looking">Not Looking</option>
        </select>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-color hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
          >
            
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProfileModal;
