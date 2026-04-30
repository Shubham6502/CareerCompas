import axios from "axios";

const BASE = "http://localhost:5000/api/resources";


export const fetchResources = async (page, search, subject) => {
  const res = await axios.get(`${BASE}/all`, {
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
  await axios.post(`${BASE}/interact`, {
    resourceId,
    action,
  },
   { withCredentials: true });
};
export const addResource = async (resourceData) => {
  console.log("API call to addResource with data:", resourceData);
  const res = await axios.post(`${BASE}/add`, resourceData, { withCredentials: true });
  return res.data;
};

