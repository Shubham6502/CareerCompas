import { getRoadmap } from "../services/roadmap.services";

import { useState } from "react";

export const useRoadmap = () => {
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const fetchRoadmap = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getRoadmap();
            setRoadmap(data);

            return data;
        } catch (error) {
            setError("Failed to fetch roadmap.");
        }
        finally {
            setLoading(false);
        }
    };

    return { roadmap, loading, error, fetchRoadmap };
};