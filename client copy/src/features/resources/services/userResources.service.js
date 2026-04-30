import axios from "axios";

  const BASE = "http://localhost:5000/api/resources";

export const fetchUserResources = async ( page, search, subject) => {

  console.log("Fetching user resources with params:", { page, search, subject });
  const res = await axios.get(`${BASE}/userresources`, {
    params: {page, limit: 6, search, subject },
    withCredentials: true
  });
  console.log("fetchUserResources response:", res.data);
  return res.data;
};


//  Update
export const updateResource = async (formData) => {
  console.log("Updating resource with data:", formData);
  await axios.put(`${BASE}/updateresource`, formData, {
    withCredentials: true
  });
};

// Delete
export const deleteResource = async (resourceId) => {
  await axios.delete(`${BASE}/deleteresource`,  { data: { resourceId } }, {
    withCredentials: true
  });
};