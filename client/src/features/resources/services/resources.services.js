import axios from "axios";
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${BASE}/api/resources`;


export const fetchResources = async (page, search, subject) => {
  const res = await axios.get(`${API_URL}/all`, {
    params: { page, limit: 6, search, subject },
    withCredentials: true,
  });
  return res.data;
};


// ✅ Top contributors
// export const topContributors = async () => {
//   const res = await axios.get(`${BASE}/topContributors`);
//   return res.data;
// };

// ✅ Interact
export const interactWithResource = async (resourceId, action) => {
   console.log("API call to interactWithResource", {resourceId, action });
  await axios.post(`${API_URL}/interact`, {
    resourceId,
    action,
  },
   { withCredentials: true });
};
export const addResource = async (resourceData) => {
  console.log("API call to addResource with data:", resourceData);
  const res = await axios.post(`${API_URL}/add`, resourceData, { withCredentials: true });
  return res.data;
};

