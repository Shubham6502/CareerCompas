import { useState } from "react";
import { X, Calendar } from "lucide-react";
import { useEffect } from "react";
import axios from "axios";

export default function EditTrackApplicationModal({
  isEditOpen,
  onClose,
  onSave,
  application,
}) {
  const [loading, setLoading] = useState(false);
  console.log(application);
  const [formData, setFormData] = useState({
    _id: "",
    company: "",
    role: "",
    location: "",
    date: "",
    status: "Applied",
    link: "",
  });
 useEffect(() => {
  if (application) {
    setFormData({
        _id: application._id,
      company: application.company || "",
      role: application.role || "",
      location: application.location || "",
      date: application.date || "",
      status: application.status || "Applied",
      link: application.link || "",
    });
  }
}, [isEditOpen]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
   const handleSubmit = async () => {
    setLoading(true);
    await onSave(formData);
    onClose();
  };

  if (!isEditOpen) return null;
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      {/* Modal Box */}
      <div className="w-full max-w-lg card-color border border-gray-800 rounded-2xl p-8 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-color hover:text-white transition"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6">Edit Application</h2>

        {/* Form */}
        <div className="space-y-5">
          {/* Company */}
          <div>
            <label className="block text-sm text-color mb-2">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Google"
              className="w-full card-color border border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-color mb-2">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Frontend Intern"
              className="w-full card-color border border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Location + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-color mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Remote"
                className="w-full card-color border border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-color mb-2">
                Date Applied
              </label>
              <div className="flex items-center card-color border border-gray-700 rounded-xl px-4 py-3 text-sm">
                <Calendar size={16} className="mr-2 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="bg-transparent outline-none w-full"
                />
              </div>
            </div>
          </div>

          {/* Status + Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-color mb-2">Status</label>
              <select
                name="status"
                onChange={handleChange}
                value={formData.status}
                className="w-full card-color border border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-color mb-2">
                Job Link (Optional)
              </label>
              <input
                name="link"
                type="text"
                onChange={handleChange}
                value={formData.link}
                placeholder="https://..."
                className="w-full card-color border border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 transition py-3 rounded-xl font-medium shadow-lg shadow-blue-500/20"
          >
            Save Application
          </button>
        </div>
      </div>
    </div>
  );
}
