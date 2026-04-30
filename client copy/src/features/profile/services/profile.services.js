import axios from "axios";
const BASE = "http://localhost:5000/api/profile";

export const fetchProfileData = async () => {
  const res = await axios.get(`${BASE}`, { withCredentials: true });

  return res.data;
};
export const updateProfileData = async (updatedData) => {
  const res = await axios.put(`${BASE}`, updatedData, {
    withCredentials: true,
  });

  return res.data;
};

export const updateProfileimage = async (imageData) => {
  const res = await axios.post(`${BASE}/updateprofileimage`, imageData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

  return res.data;
};
export const getMaxStreak = async () => {
  const res = await axios.get(`${BASE}/maxstreak`, { withCredentials: true });

  return res.data;
};

export const getSharedResourcesCountById = async () => {
  const res = await axios.get(`${BASE}/sharedresourcescount`, { withCredentials: true });
  console.log("Shared resources count response:", res.data);
  return res.data;
};
// export const editEducation = async (updatedEducation) => {
//   const res = await axios.post(`${BASE}/editeducation`, updatedEducation, {
//     withCredentials: true,
//   });
//   return res.data;
// };
// export const deleteEducation = async (educationId) => {
//   const res = await axios.delete(`${BASE}/deleteeducation/${educationId}`, {
//     withCredentials: true,
//   });
//   return res.data;
// };

export const fetchRankData = async () => {
  const res = await axios.get(`${BASE}/rank`, { withCredentials: true });
  return res.data;
};
export const getUserModules = async () => {
  console.log("Fetching user modules...");
  const res = await axios.get(`${BASE}/modules`, { withCredentials: true });
  return res.data;
};