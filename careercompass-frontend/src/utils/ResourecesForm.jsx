import axios from "axios";
import { X } from "lucide-react";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";

function UploadResourceForm({ open, onClose }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [link, setLink] = useState("");
  const [domain,setDomain]=useState("");
  const [description,setDescription]=useState("");
  const {user}=useUser();
  

  if (!open) return null;

  const handleSubmit = async(e) => {
    e.preventDefault();

    const payload = { title,domain, subject, link,description };
    console.log("Uploaded Resource:", payload);

     const res= await axios.post("https://careercompas.onrender.com/api/resource/add",{
      data:payload,
      clerkId:user.id,
      userName:user.firstName,
    });
    const data = res.data; // THIS is PromiseResult
    if(data.success){
      alert("Resources Saved Successfully");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-[90%] max-w-md bg-[#0B0F1A]
                      border border-white/10 rounded-2xl p-6 text-white">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upload Resource</h2>
          <button onClick={onClose}>
            <X className="text-white/60 hover:text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>
            <label className="text-sm text-white/70">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              required
              placeholder="Enter resource title"
              className="w-full mt-1 px-4 py-2 rounded-xl
                         bg-white/5 border border-white/10
                         outline-none focus:border-blue-400"
            />
          </div>

             <div>
            <label className="text-sm text-white/70">Domain</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 rounded-xl
                         bg-white/5 border border-white/10
                         outline-none focus:border-blue-400"
            >
              <option value=""className="bg-[#0B0F1A] text-white">Select Domain</option>
              <option value="SoftwareEngineer" className="bg-[#0B0F1A] text-white">Software Engineer</option>
              <option value="MPSC"className="bg-[#0B0F1A] text-white">MPSC</option>
              <option value="UPSC"className="bg-[#0B0F1A] text-white">UPSC</option>
              <option value="Marketing"className="bg-[#0B0F1A] text-white">Marketing</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="text-sm text-white/70">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 rounded-xl
                         bg-white/5 border border-white/10
                         outline-none focus:border-blue-400"
            >
              <option value=""className="bg-[#0B0F1A] text-white">Select subject</option>
              <option value="DSA" className="bg-[#0B0F1A] text-white">DSA</option>
              <option value="Frontend"className="bg-[#0B0F1A] text-white">Frontend</option>
              <option value="Backend"className="bg-[#0B0F1A] text-white">Backend</option>
              <option value="SystemDesign"className="bg-[#0B0F1A] text-white">System Design</option>
            </select>
          </div>

          {/* Link */}
          <div>
            <label className="text-sm text-white/70">Resource Link</label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              type="url"
              required
              placeholder="https://example.com"
              className="w-full mt-1 px-4 py-2 rounded-xl
                         bg-white/5 border border-white/10
                         outline-none focus:border-blue-400"
            />
          </div>

           <div>
            <label className="text-sm text-white/70">Description</label> <span className="text-blue-500 text-xs">(Max Length:150 characters)</span>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="textarea"
              maxLength={150}
              required
              placeholder="Enter resource Description"
              className="w-full mt-1 px-4 py-2 rounded-xl
                         bg-white/5 border border-white/10
                         outline-none focus:border-blue-400"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-white/70 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600
                         hover:bg-blue-700 shadow"
            >
              Upload
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default UploadResourceForm;
