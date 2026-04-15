import { useState, useContext } from "react";
import { X } from "lucide-react";
import { CommunityContext } from "../../../Context/CommunityContext";

export default function JoinCommunityModal({ close }) {
  const [code, setCode] = useState("");
  const { sendJoinRequest } = useContext(CommunityContext);

  const handleJoin = () => {
    const message = sendJoinRequest(code);
    alert(message);
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
      <div className="card-color w-full max-w-md p-6 rounded-2xl border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white">
            Join Community
          </h2>
          <button onClick={close}>
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Enter Invite Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-transparent border border-gray-600 rounded-lg p-3 text-white mb-6 focus:outline-none focus:border-blue-500"
        />

        <button
          onClick={handleJoin}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-white"
        >
          Send Request
        </button>
      </div>
    </div>
  );
}