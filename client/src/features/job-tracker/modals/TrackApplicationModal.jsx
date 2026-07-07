import { X, Calendar, Briefcase, MapPin, Link2, Tag } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

const STATUS_COLORS = {
  Applied:   "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  Interview: "bg-amber-500/15  text-amber-400  border-amber-500/30",
  Offer:     "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Rejected:  "bg-red-500/15   text-red-400    border-red-500/30",
};

export default function TrackApplicationModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    company: "", role: "", location: "", date: "", status: "Applied", link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.company || !formData.role) return;
    onSave(formData);
    setFormData({ company: "", role: "", location: "", date: "", status: "Applied", link: "" });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full max-w-lg card-color rounded-2xl shadow-2xl relative overflow-hidden"
            style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 64px rgba(0,0,0,0.6)" }}
          >
            {/* Top glow accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative p-6 sm:p-7">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                    <Briefcase size={14} className="text-indigo-400" />
                  </div>
                  <h2 className="text-base font-bold text-color">Track Application</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg subcard-color border border-slate-200 dark:border-white/10 flex items-center justify-center subText-color hover:text-color transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Company */}
                <FieldGroup label="Company" icon={Briefcase}>
                  <input
                    type="text" name="company" value={formData.company}
                    onChange={handleChange} placeholder="e.g. Google"
                    className="modal-input"
                  />
                </FieldGroup>

                {/* Role */}
                <FieldGroup label="Role" icon={Tag}>
                  <input
                    type="text" name="role" value={formData.role}
                    onChange={handleChange} placeholder="e.g. Frontend Engineer"
                    className="modal-input"
                  />
                </FieldGroup>

                {/* Location + Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldGroup label="Location" icon={MapPin}>
                    <input
                      type="text" name="location" value={formData.location}
                      onChange={handleChange} placeholder="e.g. Remote"
                      className="modal-input"
                    />
                  </FieldGroup>
                  <FieldGroup label="Date Applied" icon={Calendar}>
                    <input
                      type="date" name="date" value={formData.date}
                      onChange={handleChange} className="modal-input"
                    />
                  </FieldGroup>
                </div>

                {/* Status segmented */}
                <div>
                  <label className="block text-[11px] font-semibold subText-color uppercase tracking-wide mb-2">Status</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {STATUSES.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, status: s }))}
                        className={`px-2 py-2 rounded-xl text-[11px] font-semibold border transition-all ${
                          formData.status === s
                            ? STATUS_COLORS[s]
                            : "subcard-color border-slate-200 dark:border-white/8 subText-color hover:text-color"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Link */}
                <FieldGroup label="Job Link (Optional)" icon={Link2}>
                  <input
                    type="text" name="link" value={formData.link}
                    onChange={handleChange} placeholder="https://..."
                    className="modal-input"
                  />
                </FieldGroup>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold transition-colors mt-1"
                  style={{ boxShadow: "0 0 16px rgba(99,102,241,0.35)" }}
                >
                  Save Application
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FieldGroup({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[11px] font-semibold subText-color uppercase tracking-wide mb-1.5">
        <Icon size={11} />
        {label}
      </label>
      {children}
    </div>
  );
}