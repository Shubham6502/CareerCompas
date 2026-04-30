
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL;
const API_URL = `${BASE}/api`;

export const getme = async () => {
    try {
        const response = await axios.get(`${API_URL}/auth/me`, {
            withCredentials: true, // Include cookies in the request
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error.response ? error.response.data : error.message);
        throw error;
    }
};
export const register = async (email, password, displayName) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            email,
            password,
            displayName,
        }, {
            withCredentials: true, // Include cookies in the request
        });
        return response.data;
    } catch (error) {
        console.error("Error during registration:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
        }, {
            withCredentials: true, // Include cookies in the request    
        });
        return response.data;
       
    } catch (error) {
        console.error("Error during login:", error.response ? error.response.data : error.message);
        throw error;
    }
};
    export const logout = async () => {
        console.log("Initiating logout..."); // Debug log
        try {
            const response = await axios.post(`${API_URL}/auth/logout`, {}, {
                withCredentials: true, // Include cookies in the request    
            });
            console.log("Logout response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error during logout:", error.response ? error.response.data : error.message);
            throw error;
        }   

};
