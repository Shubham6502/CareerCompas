import { useState, useEffect, useCallback} from "react";
import {
  fetchResources,
  // topContributors,
  interactWithResource,
  addResource
  
} from "../services/resources.services";

export function useResources() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  // const [topContributor, setTopContributor] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);


  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res =  await fetchResources(currentPage, search, activeFilter);
        setData(res.data);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [ currentPage, search, activeFilter]);



  // useEffect(() => {
  //    topContributors()
  //     .then((res) => setTopContributor(res.data))
  //     .catch(console.error);
  // }, [refreshFlag]);

  // // ✅ Interact
  const interactResource = useCallback(
    
    (action, resourceId) => {
       
      interactWithResource(resourceId, action)
        .then(() => setRefreshFlag((f) => !f))
        .catch(console.error);
    },
    []
  );


  const refresh = () => setRefreshFlag((f) => !f);
  const goToPage = (page) => setCurrentPage(page);

  const handleSearchChange = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (val) => {
    setActiveFilter(val);
    setCurrentPage(1);
  };
  
  const handleAddResource = (newResource) => {
    addResource(newResource);
    setData((prevData) => [newResource, ...prevData]);
    
  };

  return {handleAddResource, data, loading, currentPage, totalPages, search, activeFilter, goToPage, handleSearchChange, handleFilterChange, interactResource, refresh};
}