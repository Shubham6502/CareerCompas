import axios from "axios";
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${BASE}/api/profile`;


export const fetchProfileData = async () => {
  const res = await axios.get(`${API_URL}`, { withCredentials: true });

  return res.data;
};
export const updateProfileData = async (updatedData) => {
  const res = await axios.put(`${API_URL}`, updatedData, {
    withCredentials: true,
  });

  return res.data;
};

export const updateProfileimage = async (imageData) => {
  const res = await axios.post(`${API_URL}/updateprofileimage`, imageData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

  return res.data;
};
export const getMaxStreak = async () => {
  const res = await axios.get(`${API_URL}/maxstreak`, { withCredentials: true });

  return res.data;
};

export const getSharedResourcesCountById = async () => {
  const res = await axios.get(`${API_URL}/sharedresourcescount`, { withCredentials: true });
  console.log("Shared resources count response:", res.data);
  return res.data;
};
// export const editEducation = async (updatedEducation) => {
//   const res = await axios.post(`${API_URL}/editeducation`, updatedEducation, {
//     withCredentials: true,
//   });
//   return res.data;
// };
// export const deleteEducation = async (educationId) => {
//   const res = await axios.delete(`${API_URL}/deleteeducation/${educationId}`, {
//     withCredentials: true,
//   });
//   return res.data;
// };

export const fetchRankData = async () => {
  const res = await axios.get(`${API_URL}/rank`, { withCredentials: true });
  return res.data;
};
export const getUserModules = async () => {
  console.log("Fetching user modules...");
  const res = await axios.get(`${API_URL}/modules`, { withCredentials: true });
  return res.data;
};