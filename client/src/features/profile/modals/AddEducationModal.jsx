import { useState } from "react";

const AddEducationModal = ({ userProfile, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    degree: "",
    start: "",
    end: "",
    description: "",
  });

  const [errormsg, setErrormsg] = useState("");
  const validateForm = () => {
    if (!formData.degree.trim()) {
      setErrormsg("Degree is required.");
      return false;
    }
    if (!formData.start.trim()) {
      setErrormsg("Starting year is required.");
      return false;
    }
    if (!formData.end.trim()) {
      setErrormsg("Ending year is required.");
      return false;
    } 


    return true;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    onSave(formData);
    onClose(); // Close the modal after saving
  };
  const today= new Date().toISOString().split("T")[0];

  return (
<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="card-color rounded-xl p-6 md:w-full  max-w-md space-y-4 mx-3">

        <h3 className="text-lg font-semibold text-color">Add Education</h3>
        {/* <label className="text-sm subText-color">College Name</label>
        <input
          name="college"
          onChange={handleChange}
          placeholder="College Name"
          className="w-full subcard-color rounded-lg px-4 py-2 outline-none"
        /> */}
        {errormsg && <p className="text-red-500 text-sm mt-1">{errormsg}</p>}
        <label className="text-sm subText-color">Degree/Education</label>
        <input
          name="degree"
          onChange={handleChange}
          required
          placeholder="Degree or field of study"
          className="w-full subcard-color rounded-lg px-4 py-2 outline-none"
        />
        <label className="text-sm subText-color">Starting Year</label>
        <input
          type="text"
          name="start"
          required
          onChange={handleChange}
          placeholder="eg. 2020"
          className="w-full subcard-color rounded-lg px-4 py-2 outline-none"
        />
        <label className="text-sm subText-color">Ending Year</label>
        <input
          type="text"
          name="end"
          required
          onChange={handleChange}
          placeholder="eg. 2024 or present"
          className="w-full subcard-color rounded-lg px-4 py-2 outline-none"
        />

        <label className="text-sm subText-color">Description</label>
        <input
          name="description"
          type="text"
          onChange={handleChange}
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

export default AddEducationModal;
