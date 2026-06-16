
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
export const sendOtp = async(email)=>{
    try{
        const response= await axios.post(`${API_URL}/auth/send-otp`,{email});
        return response.data;

    }
    catch(error){
        console.error("Error sending OTP:", error.response ? error.response.data : error.message);
        throw error;
    }
}
export const verifyOtp = async(email,otp)=>{
    try{
        const response= await axios.post(`${API_URL}/auth/verify-otp`,{email,otp});
        return response.data;
    }
    catch(error){
        console.error("Error verifying OTP:", error.response ? error.response.data : error.message);
        throw error;
    }

}
export const resetPassword = async(email,newPassword)=>{
    try{
        const response= await axios.post(`${API_URL}/auth/reset-password`,{email,newPassword});
        return response.data;
    }
    catch(error){
        console.error("Error resetting password:", error.response ? error.response.data : error.message);
        throw error;
    }
}
