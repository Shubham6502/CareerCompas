import axios from "axios";
const API_URL = "http://localhost:5000/api";

export const fetchDashboardData = async () => {
    try {
        const response = await axios.get(`${API_URL}/dashboard`, {
            withCredentials: true, // Include cookies in the request
        });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching dashboard data:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getUserData = async () => {
    try {
        const response = await axios.get(`${API_URL}/auth/me`, {
            withCredentials: true, // Include cookies in the request
        });
        console.log("User data fetched:", response.data);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching user data:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getRoadmap = async () => {
    try {
       
        const roadmap=await axios.get(`${API_URL}/dashboard/getUserRoadmap`, {
            withCredentials: true,
        });
        
    
          return roadmap.data;
    } catch (error) {
        console.error("Error fetching roadmap:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const comptetedTask = async (taskId, difficulty, roadmapId, totalCount, currentDay) => {
    try {
        
        const response = await axios.post(`${API_URL}/dashboard/task_completion`, {
            taskId,
            difficulty,
            roadmapId,
            totalCount,
            currentDay,
        }, {
            withCredentials: true,
        });
       
        return response.data;

    } catch (error) {
        console.error("Error updating task completion:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getActivityLog = async () => {
    try {
        const response = await axios.get(`${API_URL}/dashboard/activityLog`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching activity log:", error.response ? error.response.data : error.message);
        throw error;
    };
}
export const getcomptetedTask = async () => {
    try {
        const response = await axios.get(`${API_URL}/dashboard/getTaskCompletion`, {
            withCredentials: true,
        });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching task completion:", error.response ? error.response.data : error.message);
        throw error;
    }
};
export const getLeaderBoardData = async () => {
    try {
        const response = await axios.get(`${API_URL}/leaderboard/getLeaderBoardData`, {
            withCredentials: true,
        });
        console.log("Leaderboard data fetched:", response.data);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching leaderboard data:", error.response ? error.response.data : error.message);
        throw error;
    }
};
