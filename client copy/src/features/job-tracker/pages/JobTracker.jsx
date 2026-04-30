import { Plus, Trash2, Pencil, Search, Briefcase, Building2, Calendar, MapPin, ExternalLink, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import TrackApplicationModal from "../modals/TrackApplicationModal.jsx";
import EditTrackApplication from "../modals/EditTrackApplication.jsx";
import { useJobTracker } from "../hooks/useJobTracker.js";
import PageLoader from "../../../components/Loaders/PageLoader.jsx";

export default function JobTracker() {
  
  const [open, setOpen] = useState(false);
  const [editApp, setEditApp] = useState(false);
  const [editData, setEditData] = useState({});
  const [refresh, setRefresh] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
 
  const { applications, fetchApplications,addApplication,updateApplication,deleteApplication,filteredData,setFilteredData,loading } = useJobTracker();

  useEffect(() => {
    const fetchData = async () => {
        fetchApplications();
       filterApplications(activeFilter);
    };
    fetchData();
  }, [refresh]);
  
    
  const filterApplications = (status) => {
      setActiveFilter(status);
    if (status === "All") {
   
      setFilteredData(applications);
    } else {
      setFilteredData(applications.filter(app => app.status === status));
    }
  };

  const handleOnSave = async (data) => {
    const filterDataForBackend = {
      company: data.company,
      role: data.role,
      location: data.location,
      date: data.date,
      status: data.status,
      link: data.link,
    };
    try {
        await addApplication(filterDataForBackend);
        setRefresh(prev => !prev);
    } catch (error) {
      console.error("Error saving application:", error);
    }
  };

  const updateData = async (data) => {
    const filterDataForBackend = {
      company: data.company,
      role: data.role,
      location: data.location,
      date: data.date,
      status: data.status,
      link: data.link,
    };
    try {
        await updateApplication(data._id, filterDataForBackend);
         setRefresh(prev => !prev);
    } catch (error) {
      console.error("Error updating application:", error);
    }
    
  };

  const editApplication = (id) => {
    const appToEdit = applications.find((app) => app._id === id);

    setEditApp(true);
    setEditData(appToEdit);
  };

  const deleteData= (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      deleteApplication(id);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    let baseApps = activeFilter === "All" ? applications : applications.filter(a => a.status === activeFilter);
    
    if (!query) {
      setFilteredData(baseApps);
      return;
    }
    const filteredApps = baseApps.filter(
      (app) => app.company.toLowerCase().includes(query) || app.role.toLowerCase().includes(query)
    );
    setFilteredData(filteredApps);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Applied": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "Interview": return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "Offer": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Rejected": return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <PageLoader />
    );
  }

  const counts = {
    All: applications.length,
    Applied: applications.filter(a => a.status === "Applied").length,
    Interview: applications.filter(a => a.status === "Interview").length,
    Offer: applications.filter(a => a.status === "Offer").length,
  };

  return (    
    <div className="max-w-6xl mx-auto text-color pb-10">
      
      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-color mb-1.5">
            Applications
          </h1>
          <p className="subText-color text-sm">
            Manage and track your career opportunities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black transition-all hover:opacity-80 px-5 py-2.5 rounded-xl font-medium text-sm shadow-md"
          >
            <Plus size={16} />
            <span>New Application</span>
          </button>
        </div>
      </div>

      {/* ── CONTROLS: TABS & SEARCH ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        
        {/* Apple-style Segmented Control */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-3  items-center gap-2 p-1 rounded-xl subcard-color border card-border overflow-x-auto hide-scrollbar sm:max-w-fit">
          {["All", "Applied", "Interview", "Offer"].map(filter => (
            <button
              key={filter}
              onClick={() => filterApplications(filter)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-[12px] sm:text-[13px] font-medium transition-all whitespace-nowrap
                ${activeFilter === filter 
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm border transition-normal duration-300" 
                  : "text-gray-500 dark:text-gray-400 hover:text-color"}`}
            >
              {filter}
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] bg-black/5 dark:bg-white/10`}>
                {counts[filter]}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            onChange={handleSearch}
            placeholder="Search company or role..."
            className="w-full card-color border card-border rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-color placeholder-gray-400/80 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* ── LISTINGS ── */}
      {applications.length === 0 ? (
        <div className="card-color border card-border rounded-2xl flex flex-col items-center justify-center py-20 sm:py-24 text-center shadow-sm">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-color rounded-2xl flex items-center justify-center mb-4">
            <Briefcase size={24} strokeWidth={1.5} className="text-gray-400" />
          </div>
          <h3 className="text-base font-medium text-color mb-1">No applications yet</h3>
          <p className="text-sm subText-color max-w-xs">Click "New Application" to start tracking your job search.</p>
        </div>
      ) : (
        <>
          {/* Desktop/Tablet Column Headers (hidden on mobile) */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-2 mb-1 text-[11px] font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
            <div className="col-span-5">Company & Role</div>
            <div className="col-span-3">Date Applied</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="space-y-3 sm:space-y-3">
            {filteredData.map((app) => (
              <div
                key={app._id}
                className="card-color border border-gray-200 dark:border-color rounded-2xl shadow-sm  group"
              >
                {/* ─── DESKTOP / TABLET (md+): Horizontal grid ─── */}
                <div className="hidden md:grid grid-cols-12 gap-4 items-center px-5 py-4">
                  {/* Company & Role */}
                  <div className="col-span-5 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-color dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0">
                      <span className="text-base font-bold subText-color dark:text-gray-400">{app.company?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[14px] text-color dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {app.role}
                      </p>
                      <div className="flex items-center gap-1.5 text-[12px] subText-color dark:text-gray-400 mt-0.5">
                        <Building2 size={11} />
                        <span className="truncate">{app.company}</span>
                        {app.location && (
                          <>
                            <span className="subText-color">&bull;</span>
                            <span className="truncate max-w-[100px]">{app.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="col-span-3 flex items-center gap-1.5 text-[13px] subText-color dark:text-gray-300">
                    <Calendar size={13} className="text-gray-400 dark:text-gray-500" />
                    {new Date(app.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-1">
                    {app.link && (
                      <a
                        href={app.link.startsWith('http') ? app.link : `https://${app.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        title="Open Link"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                    <button
                      onClick={() => editApplication(app._id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => deleteApplication(app._id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* ─── MOBILE (<md): Stacked card layout ─── */}
                <div className="md:hidden p-4">
                  {/* Row 1: Avatar + Role/Company info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-color border border-color  flex items-center justify-center shrink-0">
                      <span className="text-base font-bold text-color">{app.company?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[14px] text-color truncate">{app.role}</p>
                      <div className="flex items-center gap-1.5 text-[12px] subText-color mt-0.5">
                        <Building2 size={11} className="shrink-0" />
                        <span className="truncate">{app.company}</span>
                        {app.location && (
                          <>
                            <span className="shrink-0 subText-color">&bull;</span>
                            <span className="truncate">{app.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Status + Date + Actions */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/40">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] subText-color">
                        <Calendar size={11} className="shrink-0" />
                        {new Date(app.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {app.link && (
                        <a
                          href={app.link.startsWith('http') ? app.link : `https://${app.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-gray-400 active:bg-blue-500/10 active:text-blue-500 transition-colors"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <button
                        onClick={() => editApplication(app._id)}
                        className="p-1.5 rounded-lg text-gray-400 active:bg-gray-200 dark:active:bg-white/10 active:text-gray-700 dark:active:text-white transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteData(app._id)}
                        className="p-1.5 rounded-lg text-gray-400 active:bg-red-50 dark:active:bg-red-500/10 active:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      <TrackApplicationModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSave={handleOnSave}
      />
      {editApp && (
        <EditTrackApplication
          isEditOpen={editApp}
          onClose={() => setEditApp(false)}
          onSave={updateData}
          application={editData}
        />
      )}
    </div>
  );
}
