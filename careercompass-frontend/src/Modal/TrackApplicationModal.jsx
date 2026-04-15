import { X, Calendar } from "lucide-react";
import { useState } from "react";

export default function TrackApplicationModal({ isOpen, onClose,onSave }) {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    date: "",
    status: "Applied",
    link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({    ...prev,
        [name]: value,
    }));
  };



  const handleSubmit = (e) => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      
      {/* Modal Box */}
      <div className="w-full max-w-lg card-color  rounded-2xl p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-color hover:text-white transition"
        >
          <X size={20} onClick={onClose}/>
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6">
          Track Application
        </h2>

        {/* Form */}
        <div className="space-y-5">

          {/* Company */}
          <div>
            <label className="block text-sm text-color mb-2">
              Company
            </label>
            <input
              type="text"
              name="company"
              onChange={handleChange}
              placeholder="e.g. Google (3430)"
              className="w-full card-color border border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-color mb-2">
              Role
            </label>
            <input
              type="text"
              name="role"
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
                  onChange={handleChange}
                  className="bg-transparent outline-none w-full"
                />
              </div>
            </div>

          </div>

          {/* Status + Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm text-color mb-2">
                Status
              </label>
              <select
              name="status"
                onChange={handleChange}
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
                placeholder="https://..."
                className="w-full card-color border border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

          </div>

          {/* Save Button */}
          <button onClick={handleSubmit} className="w-full bg-blue-600 text-white hover:bg-blue-700 transition py-3 rounded-xl font-medium shadow-lg shadow-blue-500/20">
            Save Application
          </button>

        </div>
      </div>
    </div>
  );
}