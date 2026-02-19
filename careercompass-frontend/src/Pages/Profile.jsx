import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import {
  UserRound,
  Pencil,
  Linkedin,
  Github,
  Link,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import ProfileSkeleton from "../hooks/ProfileSkeleton";
import EditProfileModal from "../Modal/EditProfileModal";
import EditPersonalModal from "../Modal/EditPersonalModal";
import AddEducationModal from "../Modal/AddEducationModal";
import AddLinksModal from "../Modal/AddLinksModal";
import EditEducationModal from "../Modal/EditEducationModal";
import EditProfilePictureModal from "../Modal/EditProfilePictureModal";
import { Navigate, useNavigate } from "react-router-dom";


function Profile() {
  const { user, isLoaded } = useUser();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  const [userProfile, setUserProfile] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isPersonal, setIsPersonal] = useState(false);
  const [isAddEducation, setAddEducation] = useState(false);
  const [editEducationIndex, setEditEducationIndex] = useState(null);
  const [totalResources, setTotalResources] = useState(0);
  const [isImageEdit, setIsImageEdit] = useState(false);
  const[isLoad,setLoad]=useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  
  const clerkId = user?.id;

  useEffect(() => {
    if (!isLoaded || !clerkId) {
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `https://careercompas.onrender.com/api/profile/getprofile/${clerkId}`,
        );

        setUserProfile(res.data.userProfile);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, [clerkId, isLoaded,isLoad]);

  const handleSaveProfile = async (updatedData) => {
    setIsSaving(true);
    try {
      const res = await axios.put(
        `https://careercompas.onrender.com/api/profile/update/${clerkId}`,
        updatedData,
      );

      setUserProfile(res.data.updatedProfile);
      setIsEditing(false);
      setIsPersonal(false);
      console.log("Edited");
    } catch (error) {
      console.error("Failed to update profile", error);
    }
    finally{
      setIsSaving(false);
    }
  };

  const addEducation = async (educationData) => {
    try {
      const formattedEducation = {
        ...educationData,
        score: Number(educationData.score),
        start: new Date(educationData.start),
        end: new Date(educationData.end),
      };
      
      const res = await axios.put(
        `https://careercompas.onrender.com/api/profile/add-education/${clerkId}`,
        formattedEducation,
      );

      setUserProfile(res.data.updatedProfile);
      setAddEducation(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const addLinks = async (links) => {
    const res = await axios.put(
      `https://careercompas.onrender.com/api/profile/add-links/${clerkId}`,
      links,
    );
    console.log(res.data.updatedLinks);
    setUserProfile(res.data.updatedLinks);
    setIsEditing(false);
  };
  const editEducation = async (index, formData) => {
    console.log(formData, index);
    try {
      const res = await axios.put(
        `https://careercompas.onrender.com/api/profile/edit-education/${clerkId}/${index}`,
        formData,
      );
      console.log(res.data);
      setUserProfile(res.data.updatedEducation);
      setEditEducationIndex(null);
    } catch (err) {
      console.log(err);
    }
  };
  const truncateText = (text, limit = 20) => {
    if (!text) return "";
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  useEffect(() => {
    if (!isLoaded || !clerkId) return;

    const fetchResourcesCount = async () => {
      try {
        const response = await axios.get(
          `https://careercompas.onrender.com/api/resource/user/resourcescount/${clerkId}`,
        );

        setTotalResources(response.data.count);

        // setTotalResources(totalResources); // store in state
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchResourcesCount();
  }, [isLoaded, clerkId]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
      await Promise.all([
        axios.delete(`https://careercompas.onrender.com/api/profile/delete/${clerkId}`),
        axios.delete(`https://careercompas.onrender.com/api/progress/delete/${clerkId}`),
        axios.delete(`https://careercompas.onrender.com/api/users/delete/${clerkId}`),
      ]);

      await user.delete(); // Clerk deletion
      window.location.replace("/");
    } catch (err) {
      console.error("Failed to delete account:", err);
      alert("Something went wrong while deleting your account.");
    }
  };

  const handelProfilePicture = async (data) => {
    try {
       setIsSaving(true);
      const response = await axios.put(
        `https://careercompas.onrender.com/api/profile/update-profile-picture/${clerkId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setUserProfile(response.data.updatedProfile);
      setLoad(!isLoad);
    } catch (err) {
      console.error("Failed to update profile picture", err);
    }
    finally{
      setIsSaving(false);
    }
  
    setIsImageEdit(false);
  };
  if (!isLoaded || !userProfile) {
    return <ProfileSkeleton />;
  }
  return (
    <div
      className="
        w-[95%]
        h-[90vh]
       
        overflow-hidden
      "
    >
      <div
        className="
          relative
          h-full
          overflow-y-auto
          px-6 py-3
          scrollbar-thin
          scrollbar-thumb-blue-600/40
          scrollbar-track-transparent
        "
      >
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
          {/* Profile Header */}

          <div className="relative flex flex-col sm:flex-row items-center gap-6 card-color shadow-xl rounded-2xl p-6 ">
            {/* Edit Icon */}
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 p-2 rounded-full card-color border card-border hover:bg-gray-700 transition"
              aria-label="Edit Profile"
            >
              <Pencil size={16} className="text-gray-400" />
            </button>
            <button
              onClick={handleDelete}
              className="absolute group inline-block bottom-4 right-4 p-2 rounded-full card-color border card-border hover:bg-gray-700 transition "
              aria-label="Edit Profile"
            >
              <Trash2 size={16} className="text-red-400" />
              <span
                className="absolute left-1/2 -translate-x-1/2 top-7 
                   whitespace-nowrap rounded-md bg-black px-2 py-1 
                   text-xs text-white opacity-0 
                   group-hover:opacity-100 transition"
              >
                Delete Account
              </span>
            </button>

            {/* Profile Image */}
            <div className="relative w-28 h-28 group">
              {userProfile.profilepicture ? (
                <img
                  src={userProfile.profilepicture}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover "
                />
              ) : (
                <div className="w-28 h-28 rounded-full flex items-center justify-center bg-gray-800 border card-border">
                  <UserRound size={48} className="text-gray-400" />
                </div>
              )}
              <div
                className="
      absolute inset-0
      flex items-center justify-center
      rounded-full
      bg-black/50
      opacity-0
      group-hover:opacity-100
      transition-opacity
    "
              >
                <Pencil
                  size={20}
                  onClick={() => {
                    setIsImageEdit(true);
                  }}
                  className="text-white"
                />
              </div>
            </div>
            {isImageEdit && (
              <EditProfilePictureModal
                onSave={(data) => {
                  handelProfilePicture(data);
                }}
                onClose={() => {
                  setIsImageEdit(false);
                }}
                isSaving={isSaving}
              />
            )}
            {/* Profile Info */}
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-color">
                {userProfile.firstname} {userProfile.lastname}
              </h2>

              {userProfile.bio && (
                <p className="subText-color mt-1 max-w-md">{userProfile.bio}</p>
              )}

              <p className="text-sm text-gray-500 mt-2">
                Joined on{" "}
                {new Date(userProfile.joineddate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            {isEditing && (
              <EditProfileModal
                userProfile={userProfile}
                onClose={() => setIsEditing(false)}
                onSave={handleSaveProfile}
                isSaving={isSaving}
                
              />
            )}
          </div>

          {/* Info + Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Personal Info */}
            <div className="md:col-span-2 card-color shadow-xl rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-color">
                  Personal Information
                </h3>
                <button
                  onClick={() => setIsPersonal(true)}
                  className="p-2 rounded-full card-color border card-border hover:bg-gray-700 transition"
                >
                  <span className="text-sm text-gray-400">
                    <Pencil size={15} />
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-color">
                
                <Info label="Email" value={userProfile.email} />
                <Info label="Gender" value={userProfile.gender} />
                <Info
                  label="Birth Date"
                  value={new Date(userProfile.birthdate).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                />
                <Info  label="City" value={userProfile.city} />
                {/* <Info label="College" value={userProfile.education[0].college} /> */}
              </div>
              {isPersonal && (
                <EditPersonalModal
                  userProfile={userProfile}
                  onClose={() => setIsPersonal(false)}
                  onSave={handleSaveProfile}
                />
              )}
            </div>

            {/* Stats */}
            <div className="card-color shadow-xl rounded-xl p-6 flex flex-col justify-center gap-3 items-center">
              <p className="subText-color">Total Uploaded Resources</p>
              <p className="text-4xl font-bold text-color mt-2">
                {totalResources}
              </p>
              <button
                onClick={() => {
                  navigate("/userresources");
                }}
                className="subcard-color  rounded px-3 py-2 cursor-pointer hover:bg-gray-700"
              >
                View Resources
              </button>
            </div>
            <div className="md:col-span-2 card-color shadow-xl rounded-2xl p-6 ">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-color">
                  Educational Information
                </h3>
                <button
                  onClick={() => setAddEducation(true)}
                  className="p-2 rounded-full card-color border card-border hover:bg-gray-700 transition"
                >
                  <span className="text-sm subText-color">+ Add Education</span>
                </button>
              </div>

              {/* Education Item */}
              {userProfile.education.map((edu, idx) => {
                return (
                  <div className="flex items-center justify-between mt-2 card-color border card-border rounded-xl p-4 hover:bg-gray-900 transition">
                    {/* Left Section */}
                    <div>
                      <p className="text-base font-medium text-color">
                        {edu.college}
                      </p>
                      <p className="text-sm subText-color">{edu.field}</p>
                    </div>

                    {/* Right Section */}
                    <div className="text-right flex gap-4">
                      <p className="text-lg font-semibold text-emerald-400">
                        {edu.score} %
                      </p>
                      <button
                        onClick={() => setEditEducationIndex(idx)}
                        className="p-2 rounded-full card-color border card-border hover:bg-gray-700 transition"
                      >
                        <span className="text-sm text-gray-400">
                          <Pencil size={12} />
                        </span>
                      </button>
                    </div>
                    {editEducationIndex === idx && (
                      <EditEducationModal
                        userProfile={userProfile}
                        education={edu}
                        onClose={() => setEditEducationIndex(null)}
                        onSave={(formData) => editEducation(idx, formData)}
                      />
                    )}
                  </div>
                );
              })}

              {isAddEducation && (
                <AddEducationModal
                  userProfile={userProfile}
                  onClose={() => setAddEducation(false)}
                  onSave={addEducation}
                />
              )}
            </div>
            <div className="card-color shadow-xl rounded-2xl p-5 flex flex-col gap-4 hover:border-gray-700 transition">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-color">Links</h3>
                <button
                  onClick={() => setIsLink(true)}
                  className="p-2 rounded-full card-color border card-border hover:bg-gray-700 transition"
                >
                  <Pencil size={14} className="text-gray-400" />
                </button>
              </div>

              {/* Link Item */}
              {userProfile.links.linkedin != "" && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md card-color border card-border text-green-500">
                    <Linkedin size={18} />
                  </div>

                  <a
                    href={userProfile.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-color hover:text-blue-300 underline-offset-4 hover:underline transition"
                  >
                    {truncateText(userProfile.links.linkedin)}
                  </a>
                </div>
              )}
              {userProfile.links.github != "" && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md card-color border card-border text-green-500">
                    <Github size={18} />
                  </div>

                  <a
                    href={userProfile.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-color hover:text-blue-300 underline-offset-4 hover:underline transition"
                  >
                    {truncateText(userProfile.links.github)}
                  </a>
                </div>
              )}

              {userProfile.links.portfolio != "" && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md card-color border card-border text-green-500">
                    <Link size={18} />
                  </div>

                  <a
                    href={userProfile.links.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-color hover:text-blue-300 underline-offset-4 hover:underline transition"
                  >
                    {truncateText(userProfile.links.portfolio)}
                  </a>
                </div>
              )}
              {isLink && (
                <AddLinksModal
                  userProfile={userProfile}
                  onClose={() => setIsLink(false)}
                  onSave={addLinks}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-color font-medium">{value || "—"}</p>
  </div>
);

export default Profile;
