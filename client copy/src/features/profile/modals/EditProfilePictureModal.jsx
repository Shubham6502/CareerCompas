import { useState } from "react";


const EditProfilePictureModal = ({profileData,onClose,onSave }) => {

  const [isSaving, setIsSaving] = useState(false);
  const[formData,setFormData]=useState({
    profileImage:profileData.profileImage || "",
  });
  const handleSubmit = () => {
    console.log("Submitting profile image update with data:", profileData);
    onSave(formData.profileImage);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      const formData = new FormData();
      formData.append("profileImage", file);
      setFormData({ ...formData, profileImage: file });
      }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="card-color rounded-xl p-6 md:w-full max-w-md space-y-4">
        <h3 className="text-lg font-semibold text-color">
          Update Profile Image
        </h3>
        
        <div className="space-y-3">
          {/* Hidden file input */}
          <input
            type="file"
            id="profileUpload"
            name="profileImage"
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
      subcard-color px-4 py-6
      text-sm text-color
      hover:border-emerald-500
      hover:text-emerald-400
      transition
    "
          >
            {isSaving && <span className="loader"></span>}
            <span className="font-medium">Upload Profile Image</span>
          </label>

          {/* Optional helper text */}
          <p className="text-xs subText-color">JPG, PNG up to 5MB</p>
        </div>
        {formData.profileImage && (
          <p className="text-sm text-emerald-400">Selected: {formData.profileImage.name}</p>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 subText-color hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-emerald-600 text-color rounded-lg hover:bg-emerald-500"
          >
             
             {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePictureModal;
