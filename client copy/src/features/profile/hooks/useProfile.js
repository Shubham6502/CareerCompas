import { useEffect,useState,useCallback} from "react";
import {
    fetchProfileData,updateProfileData,updateProfileimage,
    getMaxStreak, getSharedResourcesCountById ,fetchRankData, getUserModules
}from "../services/profile.services.js";


export const useProfile = () => {
    
     const [userModules, setUserModules] = useState([]);
     const getProfileData = useCallback(async () => {
    try {
      const response = await fetchProfileData();
      return response;
    } catch (error) {
      console.error("Error fetching profile data:", error);
      return null;
    }
  }, []);

    const saveProfileData=async(updatedData)=>{
        try{
            const response= await updateProfileData(updatedData);
            console.log("Profile data saved:", response);
            return response;
        }
        catch(error){
            console.error("Error saving profile data:", error);
        }
    };

    const updateProfileImageData=async(imageData)=>{
        try{
            const response= await updateProfileimage({ profileImage: imageData });
           
            return response;
        }
        catch(error){
            console.error("Error updating profile image:", error);
        }
    };

    const getMaxStreakData=async()=>{
        try{
            const response= await getMaxStreak();
           
            return response;
        }
        catch(error){
            console.error("Error fetching max streak:", error);
        }
    };

    const deleteEducationData=async(educationId)=>{
        try{
            const response= await deleteEducation(educationId);
            return response;
        }
        catch(error){
            console.error("Error deleting education:", error);
        }
    };
    //  const getSharedResourcesData=async()=>{
    //     try{
    //         const response= await getSharedResourcesById();
    //         return response;
    //     }
    //     catch(error){
    //         console.error("Error fetching shared resources:", error);
    //     } 
    // };  

    const getSharedResourcesCount=async()=>{
        try{
            const response= await getSharedResourcesCountById();
            console.log("Shared resources count fetched:", response);
            return response;
        }
        catch(error){
            console.error("Error fetching shared resources:", error);
        } 
    };  
    const fetchRank=async()=>{
        try{
            const response= await fetchRankData();
            return response;
        }        catch(error){
            console.error("Error fetching rank data:", error);
        }
    };

    useEffect(() => {
    const getUserModulesData=async()=>{
        console.log("Fetching user modules data...");
        try{
            const response= await getUserModules();
            setUserModules(response.roadmapData);
            console.log("User modules data fetched:", response.roadmapData);
            return response;
        }
        catch(error){
            console.error("Error fetching user modules:", error);
        }
       
    }
     getUserModulesData();
},[]);


    return { getProfileData, saveProfileData, updateProfileImageData, getMaxStreakData, deleteEducationData, getSharedResourcesCount, fetchRank, userModules };
};
