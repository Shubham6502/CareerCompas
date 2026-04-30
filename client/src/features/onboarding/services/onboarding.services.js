import axios from 'axios';

export async function generateRoadmap(selections) {

    const API_URL = process.env.API_URL || "http://localhost:5000/api";
   
    try {
        console.log("Generating roadmap with selections:", selections);
       const {response} = await axios.post(`${API_URL}/onboarding/roadmap`, { selections }, {
        withCredentials: true, 
       });
       console.log('Roadmap generated:', response);
       return response;

    } catch (error) {
        console.error("Error generating roadmap:", error.response ? error.response.data : error.message);
       
        throw error;
    }
};

// export { generateRoadmap };