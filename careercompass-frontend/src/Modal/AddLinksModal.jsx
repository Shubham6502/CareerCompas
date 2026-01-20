import { useState } from "react";

const AddLinksModal = ({ userProfile, onClose, onSave }) => {
const [formData, setFormData] = useState({
    linkedin:userProfile.links.linkedin||"",
    github:userProfile.links.github||"",
    portfolio:userProfile.links.portfolio||"",
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
        <h3 className="text-lg font-semibold text-white">Add Links</h3>


        <label className="text-sm text-gray-400">LinkedIn</label>
        <input
          name="linkedin"
          value={formData.linkedin}
          onChange={handleChange}
          placeholder="LinkedIn"
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none"
        />
        <label className="text-sm text-gray-400">GitHub</label>
        <input
          name="github"
          value={formData.github}
          onChange={handleChange}
          placeholder="GitHub"
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none"
        />
        <label className="text-sm text-gray-400">PortFolio</label>
        <input
          name="portfolio"
          value={formData.portfolio}
          onChange={handleChange}
          placeholder="Portfolio"
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

export default AddLinksModal;
