import { Plus, Trash2, Pencil, Edit } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import TrackApplicationModal from "../Modal/TrackApplicationModal";
import EditTrackApplication from "../Modal/EditTrackApplication";


export default function JobTracker() {
  const [applications, setApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [open, setOpen] = useState(false);
  const [editApp,setEditApp] = useState(false);
  const [editData,setEditData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const clerkId = user?.id;

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://careercompas.onrender.com/api/applications/${clerkId}`,
        );
        setApplications(response.data.applications);
        setAllApplications(response.data.applications);
       setLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setLoading(false);
      }
    };
    fetchApplications();
  }, [clerkId,refresh]);

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
      setLoading(true);
      const response = await axios.post(
        `https://careercompas.onrender.com/api/applications/${clerkId}`,
        filterDataForBackend,
      );
      setApplications(response.data.applications);
      setAllApplications(response.data.applications);

    } catch (error) {
      console.error("Error saving application:", error);
    }
    finally{
      setRefresh(prev => !prev);
      setLoading(false);
    }
  };

  const handleOnEditSave = async (data) => {
  setLoading(true);
  try {
    setEditApp(false);
    await axios.put(
      `https://careercompas.onrender.com/api/applications/${data._id}`,
      data
    );

    
    setRefresh(prev => !prev);
    setLoading(false);
  } catch (error) {
    console.error(error);
  }
};
  const editApplication = (id) => {
    const appToEdit = applications.find((app) => app._id === id);
    setEditApp(true);
    setEditData(appToEdit);

  };

  const deleteApplication = (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {

        const deleteApp = async () => {
          setLoading(true);
          try {
            await axios.delete(
              `https://careercompas.onrender.com/api/applications/${clerkId}/${id}`,
            );
            setRefresh(prev => !prev);
          } catch (error) {
            console.error("Error deleting application:", error);
          }
          finally{
            setLoading(false);
          }
        };
        deleteApp();
     
    }
  };
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    if (!query) {
    setApplications(allApplications);
    return;
  }
    const filteredApps = allApplications.filter(
      (app) =>
        app.company.toLowerCase().includes(query) ||  app.role.toLowerCase().includes(query)
    );
    setApplications(filteredApps);
   
  };

  if(loading){
    return (
      <div className="fixed inset-0 z-50 flex items-center overflow-hidden justify-center bg-black/40 backdrop-blur-sm">  
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (    
    <div className=" text-color px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Career & Placements
          </h1>
          <p className="subText-color mt-1">
            Track your journey to the dream job.
          </p>

          {/* Stats */}
          <div className="mt-4 overflow-x-hidden">
            <div className="flex gap-2 text-sm subText-color cursor-pointer min-w-max">
               <div className="flex items-center gap-2 whitespace-nowrap " onClick={()=> setApplications(allApplications)}>
                <span className="w-2 h-2 rounded-full bg-red-300"></span>
                 All ({allApplications.length})
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap   text-color " onClick={()=> setApplications(allApplications.filter(app => app.status === "Applied"))}>
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {allApplications.filter(app => app.status === "Applied").length} Applied
              </div>

              <div className="flex items-center gap-2 whitespace-nowrap   text-color" onClick={()=> setApplications(allApplications.filter(app => app.status === "Interview"))}>
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                {allApplications.filter(app => app.status === "Interview").length} In
                Progress
              </div>

              <div className="flex items-center gap-2 whitespace-nowrap    text-color  " onClick={()=> setApplications(allApplications.filter(app => app.status === "Offer"))}>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>{
                  allApplications.filter(app => app.status === "Offer").length}  Offers
              </div>
            </div>
          </div>
        </div>

        {/* Track Button */}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} />
          Track Application
        </button>
      </div>

      {/* Modal */}
      <TrackApplicationModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSave={handleOnSave}
       
      />

      {/* Search Bar */}
      <div className="mt-8">
        <input
          type="text"
          name="search "
          onChange={handleSearch}
          placeholder="Search companies, roles..."
          className="w-full card-color border border-gray-500 rounded-xl px-4 py-3 text-sm text-color placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
        { editApp &&<EditTrackApplication
                    isEditOpen={editApp}
                    onClose={() => setEditApp(false)}
                    onSave={handleOnEditSave}
                    application={editData}
                  />}

      {/* Table Section */}
  
      <div className="mt-6 card-color  shadow-xl rounded-2xl">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="grid  grid-cols-5 px-6 py-4 subText-color text-sm  border-b reverse-border">
            <span>Company</span>
            <span>Role</span>
            <span>Date Applied</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          {applications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <div className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center mb-4 text-xl">
                📁
              </div>
              <p>No applications found.</p>
            </div>
          )}
          <div className="max-h-90 overflow-y-auto">
          {applications.length > 0 &&
            applications.map((app, index) => (
              <div
                key={index}
                className="grid grid-cols-5 px-6 py-4 text-sm  items-center"
              >
                <span>{app.company}</span>
                <span>{app.role}</span>
                <span>{app.date}</span>
                <span className={`${app.status === "Applied" ? "text-blue-400" : app.status === "Interview" ? "text-purple-400" : app.status === "Offer" ? "text-green-400" : "text-red-400"}`}>{app.status}</span>
                <span className="text-right flex items-center justify-end gap-4">
                  <div
                    className="border rounded-4xl p-2"
                    onClick={() => editApplication(app._id,index)}
                  >
                    <Pencil size={16} className="text-green-400" />
                  </div>
                 

                  <div
                    className="border rounded-4xl p-2"
                    onClick={() => deleteApplication(app._id)}
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </div>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden p-4 space-y-4">
          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <div className="w-12 h-12 border border-color rounded-lg flex items-center justify-center mb-4 text-xl">
                📁
              </div>
              <p>No applications found.</p>
            </div>
          ) : (
            applications.map((app, index) => (
              <div
                key={index}
                className="card-color border reverse-border rounded-xl p-4 space-y-2"
              >
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Company</span>
                  <span className="text-sm">{app.company}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Role</span>
                  <span  className="text-sm">{app.role}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Date</span>
                  <span className="text-sm">{app.date}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Status</span>
                  <span className={`text-sm ${app.status === "Applied" ? "text-blue-400" : app.status === "Interview" ? "text-purple-400" : app.status === "Offer" ? "text-green-400" : "text-red-400"}`}>{app.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div onClick={() => deleteApplication(app._id)}>
                    <Trash2 size={16} className="text-red-400" />
                  </div>
                  <div className=" " onClick={() => editApplication(app._id,index)}>
                    <Pencil size={16} className="text-green-400" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
   
  );
}
