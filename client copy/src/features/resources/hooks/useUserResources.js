import { useState, useEffect, useCallback} from "react";
import {
  fetchUserResources,
  updateResource,
  deleteResource
} from "../services/userResources.service";

export  function useUserResources(userId) {
  const [userResources, setUserResources] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [topContributor, setTopContributor] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [loading, setLoading] = useState(true);

 const handleSearchChange = (value) => {
      setSearch(value);
      setCurrentPage(1);
    };

    const handleFilterChange = (filter) => {
      setActiveFilter(filter);
      setCurrentPage(1);
    };

      const goToPage = (page) => setCurrentPage(page);


  useEffect(() => {
       const fetchUserData = async () => { 
          setLoading(true);
          const res = await fetchUserResources( currentPage, search, activeFilter);
          setLoading(false);
          setUserResources(res.userResources);
          // setTotalPages(res.totalPages);
        }
    fetchUserData();
      
  }, [userId, currentPage, search, activeFilter, refreshFlag]);

    const update = useCallback(
      (formData) => {
        updateResource(formData)
          .then(() => setRefreshFlag((f) => !f))
          .catch(console.error);
      },
      []
    );

      // ✅ Delete
  const deleteRes = useCallback(
    (resourceId) => {
      deleteResource(resourceId)
        .then(() => setRefreshFlag((f) => !f))
        .catch(console.error);
    },
    []
  );

  return {
    userResources,
    currentPage,
    totalPages,
    search,
    goToPage,
    handleSearchChange,
    handleFilterChange,
    activeFilter,
    topContributor,
    refreshFlag,
    loading,
    update,
    deleteRes

  }
}