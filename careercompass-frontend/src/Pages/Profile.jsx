import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { UserRound, Pencil, Linkedin, Github, Link } from "lucide-react";
import { useEffect, useState } from "react";
import ProfileSkeleton from "../hooks/ProfileSkeleton";
import EditProfileModal from "../Modal/EditProfileModal";
import EditPersonalModal from "../Modal/EditPersonalModal";
import AddEducationModal from "../Modal/AddEducationModal";
import AddLinksModal from "../Modal/AddLinksModal";
import EditEducationModal from "../Modal/EditEducationModal";

function Profile() {
  const [userProfile, setUserProfile] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [isPersonal, setIsPersonal] = useState(false);
  const [isAddEducation, setAddEducation] = useState(false);
  const [editEducationIndex, setEditEducationIndex] = useState(null);

  const user1 = {
    name: "Shubham Patil",
    totalResources: 12,
  };

  const { user, isLoaded } = useUser();
  const clerkId = user?.id;

  useEffect(() => {
    if (!isLoaded || !clerkId) {
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/profile/getprofile/${clerkId}`,
        );

        setUserProfile(res.data.userProfile);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, [clerkId, isLoaded]);

  const handleSaveProfile = async (updatedData) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/profile/update/${clerkId}`,
        updatedData,
      );

      setUserProfile(res.data.updatedProfile);
      setIsEditing(false);
      setIsPersonal(false);
      console.log("Edited");
    } catch (error) {
      console.error("Failed to update profile", error);
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
      console.log(educationData);
      const res = await axios.put(
        `http://localhost:5000/api/profile/add-education/${clerkId}`,
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
      `http://localhost:5000/api/profile/add-links/${clerkId}`,
      links,
    );
    console.log(res.data.updatedLinks)
    setUserProfile(res.data.updatedLinks);
    setIsEditing(false);
  };
  const editEducation=async(index,formData)=>{
    console.log(formData,index)
    try{
      const res=await axios.put(`http://localhost:5000/api/profile/edit-education/${clerkId}/${index}`,
      formData);
      console.log(res.data)
      setUserProfile(res.data.updatedEducation);
      setEditEducationIndex(null);

    }catch(err){
      console.log(err);
    }

  }
  const truncateText = (text, limit = 20) => {
    if (!text) return "";
    return text.length > limit ? text.slice(0, limit) + "..." : text;
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

          <div className="relative flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-800">
            {/* Edit Icon */}
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              aria-label="Edit Profile"
            >
              <Pencil size={16} className="text-gray-400" />
            </button>

            {/* Profile Image */}
            {userProfile.profilepicture ? (
              <img
                src={userProfile.profilepicture}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-2 border-gray-700"
              />
            ) : (
              <div className="w-28 h-28 rounded-full flex items-center justify-center bg-gray-800 border-2 border-gray-700">
                <UserRound size={48} className="text-gray-400" />
              </div>
            )}

            {/* Profile Info */}
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-white">
                {userProfile.firstname} {userProfile.lastname}
              </h2>

              {userProfile.bio && (
                <p className="text-gray-400 mt-1 max-w-md">{userProfile.bio}</p>
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
              />
            )}
          </div>

          {/* Info + Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Personal Info */}
            <div className="md:col-span-2 bg-gray-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Personal Information
                </h3>
                <button
                  onClick={() => setIsPersonal(true)}
                  className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
                >
                  <span className="text-sm text-gray-400">
                    <Pencil size={15} />
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
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
                <Info label="City" value={userProfile.city} />
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
            <div className="bg-gray-900 rounded-xl p-6 flex flex-col justify-center items-center">
              <p className="text-gray-400">Total Uploaded Resources</p>
              <p className="text-4xl font-bold text-white mt-2">
                {user1.totalResources}
              </p>
            </div>
            <div className="md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border  border-gray-800">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Educational Information
                </h3>
                <button
                  onClick={() => setAddEducation(true)}
                  className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
                >
                  <span className="text-sm text-gray-400">+ Add Education</span>
                </button>
              </div>

              {/* Education Item */}
              {userProfile.education.map((edu,idx) => {
                return (
                  <div className="flex items-center justify-between mt-2 bg-gray-950 rounded-xl p-4 hover:bg-gray-900 transition">
                    {/* Left Section */}
                    <div>
                      <p className="text-base font-medium text-white">
                        {edu.college}
                      </p>
                      <p className="text-sm text-gray-400">{edu.field}</p>
                    </div>

                    {/* Right Section */}
                    <div className="text-right flex gap-4">
                      <p className="text-lg font-semibold text-emerald-400">
                        {edu.score} %
                      </p>
                      <button
                        onClick={() => setEditEducationIndex(idx)}
                        className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
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
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-4 hover:border-gray-700 transition">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-white">Links</h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
                >
                  <Pencil size={14} className="text-gray-400" />
                </button>
              </div>

              {/* Link Item */}
              {userProfile.links.linkedin != "" && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-800 text-green-500">
                    <Linkedin size={18} />
                  </div>

                  <a
                    href={userProfile.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white hover:text-blue-300 underline-offset-4 hover:underline transition"
                  >
                    {truncateText(userProfile.links.linkedin)}
                  </a>
                </div>
              )}
              {userProfile.links.github != "" && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-800 text-green-500">
                    <Github size={18} />
                  </div>

                  <a
                    href={userProfile.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white hover:text-blue-300 underline-offset-4 hover:underline transition"
                  >
                    {truncateText(userProfile.links.github)}
                  </a>
                </div>
              )}

              {userProfile.links.portfolio != "" && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-800 text-green-500">
                    <Link size={18} />
                  </div>

                  <a
                    href={userProfile.links.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white hover:text-blue-300 underline-offset-4 hover:underline transition"
                  >
                    {truncateText(userProfile.links.portfolio)}
                  </a>
                </div>
              )}
              {isEditing && (
                <AddLinksModal
                  userProfile={userProfile}
                  onClose={() => setIsEditing(false)}
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
    <p className="text-white font-medium">{value || "—"}</p>
  </div>
);

export default Profile;
