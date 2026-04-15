import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateCommunityModal from "../modals/CreateCommunityModal";
import JoinCommunityModal from "../modals/JoinCommunityModal";
import {useUser} from "@clerk/clerk-react"
import axios from "axios";

export default function Community() {
  const {user} = useUser();
  const currentUser = user ? user.id : null;
  const [communities,setCommunities] = useState([]);
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const generateCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const createCommunity= async(name,communityId)=>{
    const newCommunity = {
      communityId: communityId,
      name: name,
      code: generateCode(),
      owner: currentUser,
      members: [{user:currentUser,username:user.username,role:"owner"}],
     
    };
    
    await axios.post("http://localhost:5000/api/communities/create", newCommunity)
      .then((res) => {
        setCommunities([...communities, res.data]);
      })
      .catch((err) => {
        console.error("Error creating community:", err);
      });
  }

 useEffect(() => {

  const fetchCommunities = async () => {

    try {

      const response = await axios.get(
        `http://localhost:5000/api/communities/get/${currentUser}`
      );

      setCommunities(response.data);

    } catch (err) {
      console.log(err);
    }

  };

  fetchCommunities();

}, []);
// console.log(communities);
  return (
    <div className="bg-color text-color min-h-screen p-4 sm:p-8 transition-colors duration-500">
      {/* Header */}
      <div className="card-color p-6 rounded-2xl mb-8">
        <h1 className="text-2xl font-bold mb-4">
           Community Hub
        </h1>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowCreate(true)}
            className="btn-primary px-6 py-2.5 rounded-xl font-medium"
          >
            Create
          </button>

          <button
            onClick={() => setShowJoin(true)}
            className="btn-secondary px-6 py-2.5 rounded-xl font-medium"
          >
            Join
          </button>
        </div>
      </div>

      {/* Community Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
         {communities.length>0 && ( communities

          .map((community) => (
            <div
              key={community.communityId}
              onClick={() => navigate(`/community/CommunityDashboard`)}
              className="card-color card-hover p-6 rounded-2xl cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-color">
                  {community.name}
                </h3>
                <span className="bg-blue-500/10 text-blue-500 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {community.code}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-4 subText-color">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-300">
                    {community.name.charAt(0)}
                  </div>
                </div>
                <span className="text-sm font-medium">
                  {community.members.length} {community.members.length === 1 ? 'Member' : 'Members'}
                </span>
              </div>
            </div>
          )))}
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateCommunityModal
         close={() => setShowCreate(false)} 
        createCommunity={createCommunity} />
      )}

      {showJoin && (
        <JoinCommunityModal close={() => setShowJoin(false)} />
      )}
    </div>
  );
}