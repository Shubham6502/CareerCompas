import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Plus, Pencil, Trash2 } from "lucide-react";
import AddExperienceModal from "../modals/AddExperienceModal.jsx";
import EditExperienceModal from "../modals/EditExperienceModal.jsx";

export default function ExperiencePortfolio({ experiences = [], onSave, onEdit, onDelete }) {
  const [showAdd,  setShowAdd]  = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const sorted = [...experiences].sort((a, b) => {
    const ea = a.end === "present" ? new Date() : new Date(a.end);
    const eb = b.end === "present" ? new Date() : new Date(b.end);
    return eb - ea;
  });

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="card-color rounded-2xl border border-slate-100 dark:border-white/8 p-5">

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/12 border border-indigo-500/20 flex items-center justify-center">
              <Briefcase size={13} className="text-indigo-400" />
            </div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-indigo-400">Experience</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl subcard-color border border-slate-200 dark:border-white/10 subText-color hover:text-color text-[11px] font-medium transition-colors">
            <Plus size={12} /> Add
          </button>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase size={26} className="subText-color opacity-25 mx-auto mb-2" />
            <p className="text-[12px] subText-color">No experience added yet.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-[5px] top-3 bottom-3 w-px bg-gradient-to-b from-indigo-400/50 via-slate-200 dark:via-white/6 to-transparent" />
            <div className="space-y-5 pl-1">
              {sorted.map((exp, idx) => (
                <motion.div key={idx}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-4 group">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 mt-1.5 relative z-10">
                    <div className="w-[11px] h-[11px] rounded-full border-2"
                      style={{
                        borderColor:  exp.isPresent ? "#818cf8" : "rgba(139,148,158,0.4)",
                        background:   exp.isPresent ? "#818cf8" : "transparent",
                        boxShadow:    exp.isPresent ? "0 0 8px rgba(129,140,248,0.7)" : "none",
                      }} />
                  </div>
                  {/* Card */}
                  <div className="flex-1 min-w-0 subcard-color rounded-xl border border-slate-100 dark:border-white/6 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-color leading-snug">{exp.role}</p>
                        {exp.company && <p className="text-[11px] text-indigo-400 font-medium mt-0.5">{exp.company}</p>}
                        <p className="text-[10px] subText-color mt-0.5">
                          {exp.start} — {exp.end || "Present"}
                          {exp.isPresent && (
                            <span className="ml-2 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                              CURRENT
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setSelected({ experience: exp, idx }); setShowEdit(true); }}
                          className="p-1.5 rounded-lg subText-color hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                          <Pencil size={11} />
                        </button>
                        <button onClick={() => onDelete(exp, idx)}
                          className="p-1.5 rounded-lg subText-color hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-[11px] subText-color mt-2 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {showAdd && (
        <AddExperienceModal onClose={() => setShowAdd(false)}
          onSave={d => { onSave(d); setShowAdd(false); }} />
      )}
      {showEdit && (
        <EditExperienceModal experience={selected} onClose={() => setShowEdit(false)}
          onEdit={d => { onEdit(d, selected.idx); setShowEdit(false); }} />
      )}
    </>
  );
}