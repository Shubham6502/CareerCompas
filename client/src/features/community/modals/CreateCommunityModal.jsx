import { useState, useContext } from "react";
import { X } from "lucide-react";
import { CommunityContext } from "../../../context/CommunityContext";

export default function CreateCommunityModal({ createCommunity,close }) {
  const [name, setName] = useState("");
  const [communityId, setcommunityId] = useState("");
  // const { createCommunity } = useContext(CommunityContext);

  const handleCreate = () => {
    if (!name.trim()) return;
    createCommunity(name,communityId);
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
      <div className="card-color w-full max-w-md p-6 rounded-2xl border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-color">
            Create Community
          </h2>
          <button onClick={close}>
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        <input
          type="text"
          placeholder="Community Id eg (DSA101)"
          maxLength={6}
          value={communityId}
          onChange={(e) => setcommunityId(e.target.value)}
          className="w-full bg-transparent border border-gray-600 rounded-lg p-3 text-color mb-6 focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Community Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-transparent border border-gray-600 rounded-lg p-3 text-color mb-6 focus:outline-none focus:border-blue-500"
        />

        <button
          onClick={handleCreate}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-white"
        >
          Create
        </button>
      </div>
    </div>
  );
}