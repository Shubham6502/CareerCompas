import { X } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

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

export default function ResourcesForm({ open, onClose, onSuccess }) {
  const { user } = useUser();

  const [form, setForm] = useState({
    title: "", domain: "", subject: "", url: "", description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
     onSuccess(form);
      onClose();

  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md card-color border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[17px] font-semibold text-color">Upload Resource</h2>
            <p className="text-[12px] subText-color mt-0.5">Share a learning resource with the community</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl subcard-color border border-gray-200 dark:border-white/10 flex items-center justify-center subText-color hover:text-color transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form */}

          <div>
            <label className="block text-[12px] font-medium subText-color mb-1.5">Title</label>
            <input name="title" value={form.title} onChange={handleChange} type="text" required placeholder="Enter resource title" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium subText-color mb-1.5">Domain</label>
              <select name="domain" value={form.domain} onChange={handleChange} required className={selectCls}>
                <option value="">Select domain</option>
                {DOMAINS.map((d) => <option key={d} value={d}>{FIELD_LABEL[d]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium subText-color mb-1.5">Subject</label>
              <select name="subject" value={form.subject} onChange={handleChange} required className={selectCls}>
                <option value="">Select subject</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{FIELD_LABEL[s]}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium subText-color mb-1.5">Resource Link</label>
            <input name="url" value={form.url} onChange={handleChange} type="url" required placeholder="https://example.com" className={inputCls} />
          </div>

          <div>
            <label className="block text-[12px] font-medium subText-color mb-1.5">
              Description
              <span className="ml-1.5 text-blue-500 dark:text-blue-400 font-normal">
                ({form.description.length}/150)
              </span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={150}
              required
              rows={3}
              placeholder="Brief description of the resource..."
              className={`${inputCls} resize-none`}
            />
          </div>

          {error && (
            <p className="text-[12px] text-red-500 dark:text-red-400 bg-red-500/8 border border-red-500/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-medium subcard-color border border-gray-200 dark:border-white/10 text-color hover:border-gray-300 dark:hover:border-white/20 transition-all"
            >
              Cancel
            </button>
            <button
             onClick={handleSubmit}
              disabled={submitting}
              className="flex-[2] py-2.5 rounded-xl text-[13px] font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
            >
              {submitting ? "Uploading..." : "Upload Resource"}
            </button>
          </div>
       
      </div>
    </div>
  );
}
