import axios from "axios";

    const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const API_URL = `${BASE}/api`;
    
const getRoadmap = async () => {
    try {
        const roadmap = await axios.get(`${API_URL}/roadmap/getUserRoadmap`, {
            withCredentials: true,
        });
        return roadmap.data;
    } catch (error) {
        console.error("Error fetching roadmap:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export { getRoadmap };
