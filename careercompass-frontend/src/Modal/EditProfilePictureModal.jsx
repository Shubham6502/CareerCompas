import { useState } from "react";

const EditProfilePictureModal = ({ userProfile, onClose, onSave ,isSaving}) => {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("profilepicture", file);
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md space-y-4">
        <h3 className="text-lg font-semibold text-white">
          Update Profile Image
        </h3>
        
        <div className="space-y-3">
          {/* Hidden file input */}
          <input
            type="file"
            id="profileUpload"
            name="profilepicture"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />

          {/* Visible upload option */}
          <label
            htmlFor="profileUpload"
            className="
      flex items-center justify-center gap-2
      w-full cursor-pointer
      rounded-lg border border-dashed border-gray-600
      bg-gray-800 px-4 py-6
      text-sm text-gray-300
      hover:border-emerald-500
      hover:text-emerald-400
      transition
    "
          >
            {isSaving && <span className="loader"></span>}
            <span className="font-medium">Upload Profile Image</span>
          </label>

          {/* Optional helper text */}
          <p className="text-xs text-gray-400">JPG, PNG up to 5MB</p>
        </div>
        {file && (
          <p className="text-sm text-emerald-400">Selected: {file.name}</p>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
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

export default EditProfilePictureModal;
