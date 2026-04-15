import { createContext, useState } from "react";

export  const CommunityContext = createContext();

export const CommunityProvider = ({ children }) => {
  const currentUser = "Shubham";

  const [communities, setCommunities] = useState([
    {
      id: 1,
      name: "VCK",
      members: ["Shubham"],
      code: "UPL9EZ",
      owner: "Shubham",
      joinRequests: [],
    },
  ]);

  const generateCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const createCommunity = (name) => {
    const newCommunity = {
      id: Date.now(),
      name,
      members: [currentUser],
      code: generateCode(),
      owner: currentUser,
      joinRequests: [],
    };

    setCommunities([...communities, newCommunity]);
  };

  const sendJoinRequest = (code) => {
    const community = communities.find((c) => c.code === code);

    if (!community) return "Invalid Code";
    if (community.members.includes(currentUser))
      return "Already a member";

    community.joinRequests.push(currentUser);
    setCommunities([...communities]);
    return "Request Sent";
  };

  const approveRequest = (communityId, user) => {
    const updated = communities.map((c) => {
      if (c.id === communityId) {
        return {
          ...c,
          members: [...c.members, user],
          joinRequests: c.joinRequests.filter((u) => u !== user),
        };
      }
      return c;
    });

    setCommunities(updated);
  };

  return (
    <CommunityContext.Provider
      value={{
        communities,
        currentUser,
        createCommunity,
        sendJoinRequest,
        approveRequest,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};