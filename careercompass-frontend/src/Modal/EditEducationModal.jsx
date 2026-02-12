import { useState } from "react";

const EditEducationModal = ({ education, onClose, onSave }) => {

  const [errormsg, setErrormsg] = useState("");
  const [formData, setFormData] = useState({
    college: education.college || "",
    field: education.field || "",
    score: education.score || "",
    start: education.start || "",
    end: education.end || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name==="score"){
    const score=Number(value);
    if(score<0 || score>100) {
      setErrormsg("Score must be between 0 and 100");
      return;
    }
    setErrormsg("");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };
  const today= new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="card-color rounded-xl p-6 w-full max-w-md space-y-4">
        <h3 className="text-lg font-semibold text-color">Edit Education</h3>
        <label className="text-sm subText-color">College Name</label>
        <input
          name="college"
          value={formData.college}
          onChange={handleChange}
          placeholder="College Name"
          className="w-full subcard-color rounded-lg px-4 py-2 outline-none"
        />
        <label className="text-sm subText-color">Department</label>
        <input
          name="field"
          value={formData.field}
          onChange={handleChange}
          placeholder="Department"
          className="w-full subcard-color rounded-lg px-4 py-2 outline-none"
        />
        <label className="text-sm subText-color">Starting Date</label>
        <input
          type="date"
          value={formData.start}
          name="start"
          max={today}
          onChange={handleChange}
          placeholder="start"
          className="w-full subcard-color rounded-lg px-4 py-2 outline-none"
        />
        <label className="text-sm subText-color">Ending Date</label>
        <input
          type="date"
          value={formData.end}
          name="end"
          onChange={handleChange}
          placeholder="end"
          className="w-full subcard-color rounded-lg px-4 py-2 outline-none"
        />

        <label className="text-sm subText-color">Percentage</label>
        <input
          name="score"
          value={formData.score}
          type="number"
          max="100"
          min="0"
          onChange={handleChange}
          placeholder="Score"
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
