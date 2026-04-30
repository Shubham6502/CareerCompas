import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:5000/api";

export const getJobApplications = async () => {
    try {
        const response = await axios.get(`${API_URL}/applications/get`, { withCredentials: true });
        if(response.data.length === 0) {
            console.log("No applications found for the user.");
            return [];
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching job applications:", error);
        throw error;
    }
};

export const addJobApplication = async (applicationData) => {
    try {
        console.log("Adding job application with data:", applicationData);
        const response = await axios.post(`${API_URL}/applications/add`, applicationData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error adding job application:", error);
        throw error;
    }
};

export const updateJobApplication = async (applicationId, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/applications/edit/${applicationId}`, updatedData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error updating job application:", error);
        throw error;
    }
};

export const deleteJobApplication = async (applicationId) => {
    try {
        const response = await axios.delete(`${API_URL}/applications/delete/${applicationId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error deleting job application:", error);
        throw error;
    }
};
