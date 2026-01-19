import { useState } from "react";

const AddEducationModal = ({ userProfile, onClose, onSave }) => {
const [formData, setFormData] = useState({
    college: "",
    field: "",
    score: "",
    start: "",
    end: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = () => {
    console.log(formData);
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md space-y-4">
        <h3 className="text-lg font-semibold text-white">Add Education</h3>

        <input
          name="college"
          onChange={handleChange}
          placeholder="College Name"
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none"
        />

        <input
          name="field"
          onChange={handleChange}
          placeholder="Department"
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none"
        />

        <input
          type="date"
          name="start"
          onChange={handleChange}
          placeholder="start"
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none"
        />
        <input
          type="date"
          name="end"
          onChange={handleChange}
          placeholder="end"
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none"
        />

       

        <input
          name="score"
         type="number"
          onChange={handleChange}
          placeholder="Score"
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

export default AddEducationModal;
