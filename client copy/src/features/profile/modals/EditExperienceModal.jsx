import { useState } from "react";

const EditExperienceModal = ({ experience, onClose,onEdit }) => {
  console.log("Experience passed to EditExperienceModal:", experience);
  const [formData, setFormData] = useState({
    role: experience.experience.role || "",
    start: experience.experience.start || "",
    end: experience.experience.end || "",
    description: experience.experience.description || "",
    isPresent: experience.experience.isPresent || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      if (name === "isPresent") {
        return {
          ...prev,
          isPresent: checked,
          end: checked ? "present" : "",
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  
const handleSubmit = () => {
  const updatedData = {
    ...formData,
    end: formData.isPresent ? "present" : formData.end,
  };
  console.log("Submitting edited experience data:", updatedData);
  onEdit(updatedData, experience.idx);
  onClose();
};
  
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="card-color rounded-xl p-6 md:w-full  max-w-md space-y-4 mx-3">
        <h3 className="text-lg font-semibold text-color">Edit Experience</h3>
        {/* <label className="text-sm subText-color">College Name</label>
        <input
          name="college"
          onChange={handleChange}
          placeholder="College Name"
          className="w-full subcard-color rounded-lg px-4 py-2 outline-none"
        /> */}
        <label className="text-sm subText-color">Role</label>
        <input
          name="role"
          onChange={handleChange}
          value={formData.role}
          placeholder="Software Engineer @ Google"
          className="w-full subcard-color rounded-lg px-4 py-2 outline-none"
        />

        <label className="text-sm subText-color">Starting Year</label>
        <input
          type="text"
          name="start"
          onChange={handleChange}
          value={formData.start}
          placeholder="eg. 2020"
          className="w-full subcard-color rounded-lg px-4 py-2 outline-none"
        />
        <label className="text-sm subText-color">Ending Year</label>
        <input
          type="text"
          name="end"
          disabled={formData.isPresent}
          value={formData.isPresent ? "present" : formData.end}
          onChange={handleChange}
          placeholder="eg. 2024 or present"
          className="w-full subcard-color rounded-lg px-4 py-2 outline-none"
        />

        <label className="text-sm subText-color flex items-center gap-2">
          <input
            type="checkbox"
            name="isPresent"
            checked={formData.isPresent}
            onChange={handleChange}
          />
          I currently work here
        </label>

        <label className="text-sm subText-color">Description</label>
        <input
          name="description"
          type="text"
          onChange={handleChange}
          value={formData.description}
          placeholder="Description (optional)"
          className="w-full subcard-color rounded-lg px-4 py-2 outline-none"
        />

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-color hover:text-white"
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

export default EditExperienceModal;
