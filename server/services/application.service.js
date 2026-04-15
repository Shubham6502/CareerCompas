import { JobApplication } from "../models/job_application.js";

export const getAllApplications= async(userId)=>{
    
        const applications= await JobApplication.findOne({ userId });
            if (!applications) {
              
                throw new Error("Application Not Found")
            }
               
    return applications;
}