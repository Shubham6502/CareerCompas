import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const EditResourceModal = ({ card, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    description: "",
    subject: "",
    domain: "",
    url: "",
  });
useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (card) {
      setFormData({
        _id: card._id || "",
        title: card.title || "",
        description: card.description || "",
        subject: card.subject || "",
        domain: card.domain || "",
        url: card.url || "",
      });
    }
  }, [card]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-white">Edit Resource</h3>

        <label className="text-sm text-gray-400">Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none"
        />
        <label className="text-sm text-gray-400">Domain</label>
        <select
          name="domain"
          value={formData.domain}
          onChange={handleChange}
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none"
        >
              <option value="SoftwareEngineer" >Software Engineer</option>
              <option value="MPSC">MPSC</option>
              <option value="UPSC">UPSC</option>
              <option value="Marketing">Marketing</option>
         
        </select>
        <label className="text-sm text-gray-400">Subject</label>
        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none"
        >
          <option value="">Select subject</option>
          <option value="DSA">DSA</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="SystemDesign">System Design</option>
        </select>
        

        <label className="text-sm text-gray-400">URL</label>
        <input
          name="url"
          value={formData.url}
          onChange={handleChange}
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none"
        />

        <label className="text-sm text-gray-400">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={150}
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
    </div>,
    document.body
  );
};

export default EditResourceModal;
