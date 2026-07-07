import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Plus, Pencil, Trash2 } from "lucide-react";
import AddEducationModal from "../modals/AddEducationModal.jsx";
import EditEducationModal from "../modals/EditEducationModal.jsx";

export default function EducationPortfolio({ education = [], onSave, onEdit, onDelete }) {
  const [showAdd,  setShowAdd]  = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const sorted = [...education].sort((a, b) => {
    const ea = a.end === "Present" ? new Date() : new Date(a.end);
    const eb = b.end === "Present" ? new Date() : new Date(b.end);
    return eb - ea;
  });

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12 }}
        className="card-color rounded-2xl border border-slate-100 dark:border-white/8 p-5">

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/12 border border-amber-500/20 flex items-center justify-center">
              <GraduationCap size={13} className="text-amber-400" />
            </div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-amber-400">Education</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl subcard-color border border-slate-200 dark:border-white/10 subText-color hover:text-color text-[11px] font-medium transition-colors">
            <Plus size={12} /> Add
          </button>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-8">
            <GraduationCap size={26} className="subText-color opacity-25 mx-auto mb-2" />
            <p className="text-[12px] subText-color">No education added yet.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-[5px] top-3 bottom-3 w-px bg-gradient-to-b from-amber-400/50 via-slate-200 dark:via-white/6 to-transparent" />
            <div className="space-y-5 pl-1">
              {sorted.map((edu, idx) => (
                <motion.div key={idx}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-4 group">
                  <div className="flex-shrink-0 mt-1.5 relative z-10">
                    <div className="w-[11px] h-[11px] rounded-full border-2"
                      style={{
                        borderColor: edu.active ? "#f59e0b" : "rgba(139,148,158,0.4)",
                        background:  edu.active ? "#f59e0b" : "transparent",
                        boxShadow:   edu.active ? "0 0 8px rgba(245,158,11,0.6)" : "none",
                      }} />
                  </div>
                  <div className="flex-1 min-w-0 subcard-color rounded-xl border border-slate-100 dark:border-white/6 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-color leading-snug">{edu.degree}</p>
                        {edu.institution && <p className="text-[11px] text-amber-400 font-medium mt-0.5">{edu.institution}</p>}
                        <p className="text-[10px] subText-color mt-0.5">
                          {edu.start && `${edu.start} — ${edu.end || "Present"}`}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setSelected({ education: edu, idx }); setShowEdit(true); }}
                          className="p-1.5 rounded-lg subText-color hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
                          <Pencil size={11} />
                        </button>
                        <button onClick={() => onDelete(edu._id)}
                          className="p-1.5 rounded-lg subText-color hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                    {edu.description && (
                      <p className="text-[11px] subText-color mt-2 leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {showAdd && (
        <AddEducationModal onClose={() => setShowAdd(false)}
          onSave={d => { onSave(d); setShowAdd(false); }} />
      )}
      {showEdit && (
        <EditEducationModal education={selected} onClose={() => setShowEdit(false)}
          onEdit={d => { onEdit(d, selected.idx); setShowEdit(false); }} />
      )}
    </>
  );
}