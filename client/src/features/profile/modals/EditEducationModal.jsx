import { useState } from "react";

const EditEducationModal = ({ education, onClose,onEdit  }) => {
console.log("EditEducationModal received education data:", education);
  const [errormsg, setErrormsg] = useState("");
  const [formData, setFormData] = useState({
    degree: education.education.degree || "",
    start: education.education.start || "",
    end: education.education.end || "",
    description: education.education.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.degree.trim()) {
      setErrormsg("Degree is required.");
      return;
    }
    console.log("Submitting edited education data:", formData);
    onEdit(formData);
  };
  const today= new Date().toISOString().split("T")[0];

  return (
<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="card-color rounded-xl p-6 w-full max-w-md space-y-4">
        <h3 className="text-lg font-semibold text-color">Edit Education</h3>
        <label className="text-sm subText-color">Degree/Education</label>
        <input
          name="degree"
          onChange={handleChange}
          value={formData.degree}
          placeholder="Degree or field of study"
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
          onChange={handleChange}
          value={formData.end}

          placeholder="eg. 2024 or present"
          className="w-full subcard-color rounded-lg px-4 py-2 outline-none"
        />

        <label className="text-sm subText-color">Description</label>
        <input
          name="description"
          type="text"
          onChange={handleChange}
          value={formData.description}
          placeholder="Description (optional)"
          className="w-full subcard-color rounded-lg px-4 py-2 outline-none"
        />
        {errormsg && <p className="text-red-500 text-sm mt-1">{errormsg}</p>}


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

export default EditEducationModal;
