import { useState } from "react";

const EditProfileModal = ({ userProfile, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstname: userProfile.firstname || "",
    lastname:userProfile.lastname||"",
    bio: userProfile.bio || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md space-y-4">
        
        <h3 className="text-lg font-semibold text-white">
          Edit Profile
        </h3>

        <input
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none"
        />
         <input
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none"
        />


        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Bio"
          rows={3}
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none resize-none"
        />

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProfileModal;
