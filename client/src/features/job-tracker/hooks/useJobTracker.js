import { getJobApplications,addJobApplication,updateJobApplication,deleteJobApplication } from "../services/jobTracker.services";

import { useState, useEffect } from "react";

export const useJobTracker = () => {
    const [applications, setApplications] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getJobApplications();
            setApplications(data);
            setFilteredData(data);
        } catch (error) {
            setError("Failed to fetch job applications.");
        }
        finally {
            setLoading(false);
        }
    };

    const addApplication = async (applicationData) => {
        try {
            const newApplication = await addJobApplication(applicationData);
            setApplications((prev) => [...prev, newApplication]);
        } catch (error) {
            setError("Failed to add job application.");
        }
    };

    const updateApplication = async (applicationId, updatedData) => {
        try {
            const updatedApplication = await updateJobApplication(applicationId, updatedData);
           console.log("updated")
        } catch (error) {
            setError("Failed to update job application.");
        }
    };

    const deleteApplication = async (applicationId) => {
        try {
            await deleteJobApplication(applicationId);
            setApplications((prev) => prev.filter((app) => app._id !== applicationId));
        } catch (error) {
            setError("Failed to delete job application.");
        }
    };

    return { applications, loading, error, fetchApplications, addApplication, updateApplication, deleteApplication ,filteredData,setFilteredData};
};
