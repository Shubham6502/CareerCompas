import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../auth/auth.context";
import PageLoader from "../../../components/Loaders/PageLoader";
import { useResources } from "../hooks/useResources";
import ResourcesHeader from "../components/ResourcesHeader";
import ResourceFilters from "../components/ResourceFilters";
import ResourceList from "../components/ResourceList";
import ResourcePagination from "../components/ResourcePagination";
import ResourceSidebar from "../components/ResourceSidebar";
import ResourcesForm from "../modals/ResourcesForm";

export default function Resources() {
 
  const [uploadOpen, setUploadOpen] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false);
  const {handleAddResource, data, loading, currentPage, totalPages, search, activeFilter, goToPage, handleSearchChange, handleFilterChange,interactResource} = useResources();

  const handleSumbit = (newResource) => {
    console.log("New Resource Data:", newResource);
    handleAddResource(newResource);
  };
  const interact = (action,resourceId) => {
    console.log("Interacting with resource:", { resourceId, action });
    interactResource(action, resourceId);
  };

  const handleSearch = (val) => {
    setSearchClicked(true);
    handleSearchChange(val);
  };

  const handleFilter = (val) => {
    setSearchClicked(true);
    handleFilterChange(val);
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
            <ResourceList data={data} onInteract={interact} mode="publicResources" />
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