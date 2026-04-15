import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Users,
  Bell,
  Trophy,
  MessageCircle,
  ListTodo,
} from "lucide-react";

import ApprovalPanel from "../components/ApprovalPanel.jsx";
import Leaderboard from "../components/Leaderboard.jsx";
import TaskSection from "../components/TaskSection.jsx";
// import AnnouncementSection from "../components/community/AnnouncementSection";
import MembersPanel from "../components/MemberPanel.jsx";
import DiscussionPanel from "../components/DiscussionPanel.jsx";
// import { CommunityContext } from "../../../context/CommunityContext.jsx";

export default function CommunityDashboard() {
  const currentUser = "Shubham";
  const owner = "Shubham";
  // const { id } = useParams();
  // const communities=useContext(CommunityContext);
  // const community = communities.find(
  //   (c) => c.id === Number(id)
  // );

  const [showApproval, setShowApproval] = useState(false);
  const [activeTab, setActiveTab] = useState("leaderboard");

  const isOwner = currentUser === owner;
  // if (!community) {
  //   return (
  //     <div className="bg-color min-h-screen flex items-center justify-center text-white">
  //       Community not found
  //     </div>
  //   );
  // }

  return (
    <div className="bg-color text-color transition-colors duration-500 min-h-screen p-4 sm:p-8">

      {/* HEADER */}
      <div className="card-color p-6 rounded-2xl mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">VCK Community</h1>
          <p className="subText-color text-sm mt-1">
            7 Members
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setShowApproval(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-amber-500/30 transition-all"
          >
            <Bell size={16} /> Requests
          </button>
        )}
      </div>

      {/* TABS */}
      <div className="flex gap-4 overflow-x-auto mb-6 pb-2">
        <Tab icon={<Trophy size={16} />} label="Leaderboard" onClick={() => setActiveTab("leaderboard")} active={activeTab === "leaderboard"} />
        <Tab icon={<ListTodo size={16} />} label="Tasks" onClick={() => setActiveTab("tasks")} active={activeTab === "tasks"} />
        <Tab icon={<Users size={16} />} label="Members" onClick={() => setActiveTab("members")} active={activeTab === "members"} />
        <Tab icon={<MessageCircle size={16} />} label="Discussion" onClick={() => setActiveTab("discussion")} active={activeTab === "discussion"} />
      </div>

      {/* CONTENT */}
      {activeTab === "leaderboard" && <Leaderboard />}
      {activeTab === "tasks" && <TaskSection isOwner={isOwner} />}
      {activeTab === "members" && <MembersPanel isOwner={isOwner} />}
      {activeTab === "discussion" && <DiscussionPanel />}

      {/* Approval Side Panel */}
      {showApproval && (
        <ApprovalPanel close={() => setShowApproval(false)} />
      )}
    </div>
  );
}

function Tab({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl whitespace-nowrap font-medium transition-all ${
        active
          ? "btn-primary shadow-md"
          : "subcard-color hover:bg-gray-100 dark:hover:bg-gray-800 text-color"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}