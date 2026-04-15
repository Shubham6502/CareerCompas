import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const SUBJECTS = ["DSA", "Frontend", "Backend", "SystemDesign"];
const DOMAINS  = ["SoftwareEngineer", "MPSC", "UPSC", "Marketing"];
const FIELD_LABEL = {
  SoftwareEngineer: "Software Engineer",
  MPSC: "MPSC", UPSC: "UPSC", Marketing: "Marketing",
  DSA: "DSA", Frontend: "Frontend", Backend: "Backend", SystemDesign: "System Design",
};

const inputCls = `w-full bg-color border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5
  text-[13px] text-color placeholder:subText-color
  focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50
  transition-all duration-200`;

const selectCls = `w-full bg-color border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5
  text-[13px] text-color
  focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50
  transition-all duration-200 cursor-pointer`;

export default function EditResourceModal({ card, onClose, onSave }) {
  const [formData, setFormData] = useState({
    _id: "", title: "", description: "", subject: "", domain: "", url: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  useEffect(() => {
    if (card) {
      setFormData({
        _id:         card._id         || "",
        title:       card.title       || "",
        description: card.description || "",
        subject:     card.subject     || "",
        domain:      card.domain      || "",
        url:         card.url         || "",
      });
    }
  }, [card]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md card-color border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-[17px] font-semibold text-color">Edit Resource</h3>
            <p className="text-[12px] subText-color mt-0.5">Update your resource details</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl subcard-color border border-gray-200 dark:border-white/10 flex items-center justify-center subText-color hover:text-color transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-[12px] font-medium subText-color mb-1.5">Title</label>
            <input name="title" value={formData.title} onChange={handleChange} className={inputCls} placeholder="Resource title" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium subText-color mb-1.5">Domain</label>
              <select name="domain" value={formData.domain} onChange={handleChange} className={selectCls}>
                <option value="">Select domain</option>
                {DOMAINS.map((d) => <option key={d} value={d}>{FIELD_LABEL[d]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium subText-color mb-1.5">Subject</label>
              <select name="subject" value={formData.subject} onChange={handleChange} className={selectCls}>
                <option value="">Select subject</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{FIELD_LABEL[s]}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium subText-color mb-1.5">URL</label>
            <input name="url" value={formData.url} onChange={handleChange} type="url" className={inputCls} placeholder="https://example.com" />
          </div>

          <div>
            <label className="block text-[12px] font-medium subText-color mb-1.5">
              Description
              <span className="ml-1.5 text-blue-500 dark:text-blue-400 font-normal">
                ({formData.description.length}/150)
              </span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={150}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Brief description..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-medium subcard-color border border-gray-200 dark:border-white/10 text-color hover:border-gray-300 dark:hover:border-white/20 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-[2] py-2.5 rounded-xl text-[13px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 active:scale-[0.98]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
