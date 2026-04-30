import { useState } from "react";
import Card from "./Card";
import SectionLabel from "./SectionLabel.jsx";
import {Pencil} from 'lucide-react';
import AddEducationModal from '../modals/AddEducationModal.jsx'
import EditEducationModal from '../modals/EditEducationModal.jsx'



export default function EducationPortfolio({ education,onSave,onClose,onEdit,onDelete }) {

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState(null);

  const handleClick = () => {
    setShowModal(true);
  };
  const handleEdit=(education,idx)=>{
   console.log("Edit button clicked for education:", education);
    setSelectedEducation({education,idx});
    setShowEditModal(true);
  }
  const handleOnsave=(newEducation)=>{
    onSave(newEducation);
    setShowModal(false);
  };
  const handleEditSave=(updatedEducation)=>{
    onEdit(updatedEducation,selectedEducation.idx);
    setShowEditModal(false);
  };
  education.sort((a, b) => {
    const endA = a.end === "Present" ? new Date() : new Date(a.end);
    const endB = b.end === "Present" ? new Date() : new Date(b.end);
    return endB - endA;
  });
  
  return (
    <>
    <Card>
      <div className="flex items-center justify-between mb-4">
      <SectionLabel>Education Portfolio</SectionLabel>
     <span onClick={handleClick}><Pencil className="w-8 h-8 border rounded-full p-2"/></span> 
      </div>

      <div className="space-y-5">
        {education.map( (edu,idx) => (
          <div key={idx} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                style={{
                  backgroundColor: edu.active ? "#3fb950" : "#8b949e",
                  boxShadow: edu.active ? "0 0 6px #3fb950" : "none",
                }}
              />
              <div
                className="w-px flex-1 mt-1"
                style={{ backgroundColor: "rgba(139,148,158,0.2)" }}
              />
            </div>
            <div className="pb-2">
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text-color)" }}
              >
                {edu.degree}
              </p>
              <p
                className="text-[10px] tracking-widest mb-1"
                style={{ color: "var(--subText-color)" }}
              >
               {edu.start ? `(${edu.start} - ${edu.end})` : ""}
              </p>
              <p className="text-xs" style={{ color: "var(--subText-color)" }}>
                {edu.description}
              </p>
              <div className="flex gap-3 ">
               <button onClick={() => handleEdit(edu,idx)} className=" mt-2 text-xs border px-2 py-1 rounded-full " style={{ color: "var(--text-color)", borderColor: "var(--subText-color)" }}>
                Edit
              </button>
               <button onClick={() => onDelete(edu._id)} className=" mt-2 text-xs border px-2 py-1 rounded-full bg-red-400/30 text-white " style={{ color: "var(--text-color)", borderColor: "var(--subText-color)" }}>
                Delete
              </button>
              </div>
            </div>
           
          </div>
          
        ))}
      </div>
     
    </Card>
    {showModal && <AddEducationModal onClose={() => setShowModal(false)} onSave={handleOnsave} />}

    {showEditModal && <EditEducationModal  education={selectedEducation} onClose={() => setShowEditModal(false)} onEdit={handleEditSave} />}
    </>
  );
}