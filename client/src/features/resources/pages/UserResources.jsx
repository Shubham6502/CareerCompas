import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../auth/auth.context.js";
import PageLoader from "../../../components/Loaders/PageLoaderjsx";
import { useUserResources } from "../hooks/useUserResources.js";
import ResourcesHeader from "../components/ResourcesHeaderjsx";
import ResourceFilters from "../components/ResourceFiltersjsx";
import ResourceList from "../components/ResourceListjsx";
import ResourcePagination from "../components/ResourcePaginationjsx";
import ResourcesForm from "../modals/ResourcesFormjsx";
import {useResources} from "../hooks/useResources.js";


export default function Resources() {
 
  const [uploadOpen, setUploadOpen] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false);

   
  const {userResources,currentPage,totalPages,handleSearchChange,handleFilterChange,search,goToPage,activeFilter,
    loading,topContributor,
    refreshFlag,
    update,
    deleteRes} = useUserResources();

  const {handleAddResource} = useResources();

  const handleSumbit = (newResource) => {
    handleAddResource(newResource);
  };

  const handleSearch = (val) => {
    setSearchClicked(true);
    handleSearchChange(val);
  };
  
  const handleFilter = (val) => {
    setSearchClicked(true);
    handleFilterChange(val);
  };

    const handleEdit = (resource) => {
      update(resource);
    };

    const handleDelete = (resourceId) => {
      if (window.confirm("Are you sure you want to delete this resource?")) {
        deleteRes(resourceId);
      }
    };
  


  if (loading && !searchClicked) {
    return <PageLoader />;
  }


  return (
    <div className="w-full text-color px-2 md:px-4  flex flex-col overflow-hidden"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <ResourcesHeader onUpload={() => setUploadOpen(true)} />

      <ResourceFilters
        search={search}
        onSearchChange={handleSearch}
        activeFilter={activeFilter}
        onFilterChange={handleFilter}
      />

      <div className="flex gap-5 flex-1 min-h-0">
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <ResourceList data={userResources} onEdit={handleEdit} onDelete={handleDelete} mode="userResources" />
          </div>

          <ResourcePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>

        {/* <ResourceSidebar topContributor={topContributor} /> */}
      </div>

      <ResourcesForm
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={handleSumbit}
      />
    </div>
  );
}