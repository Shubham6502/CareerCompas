import axios from 'axios';

export async function generateRoadmap(selections) {
   
    try {
        console.log("Generating roadmap with selections:", selections);
       const {response} = await axios.post('https://careercompas.onrender.com/api/onboarding/roadmap',{selections}, {
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