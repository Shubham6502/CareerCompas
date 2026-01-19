import { useState } from "react";

const EditPersonalModal = ({ userProfile, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    email: userProfile.email || "",
    gender: userProfile.gender || "",
    birthdate: userProfile.birthdate ? userProfile.birthdate.split("T")[0]:"",
    city: userProfile.city || "",
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
        <h3 className="text-lg font-semibold text-white">Edit Profile</h3>

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none"
        />
        <input
          type="date"
          name="birthdate"
          value={formData.birthdate}
          onChange={handleChange}
          placeholder="birthdate"
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none"
        />

        <div className="space-y-1">
          <label className="text-sm text-gray-400">Gender</label>

          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none border border-gray-700 focus:border-emerald-500"
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none"
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

export default EditPersonalModal;
