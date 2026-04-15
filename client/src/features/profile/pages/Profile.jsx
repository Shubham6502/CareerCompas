import { use, useEffect, useState } from 'react';
import EarnedBadges from '../components/EarnedBadges';
import StatsRow from '../components/StatsRow';
import ProfileHeader from '../components/ProfileHeader';
import SharedResources from '../components/SharedResources';
import ActiveModule from '../components/ActiveModule';
import CourseProgress from '../components/CourseProgress';
import ExperiencePortfolio from '../components/ExperiencePortfolio';
import EducationPortfolio from '../components/EducationPortfolio';
import KnowledgeHeatmap from '../components/KnowledgeHeatmap';
import {useProfile} from '../hooks/useProfile.js';

const PROFILE_DATA =  {
  // name: "Shubham Patil",
  // bio: "Full Stack Developer passionate about MERN stack and DSA. Building the future of tech education.",
  tags: ["SOFTWARE ENGINEER", "CONTENT CREATOR", "OPEN SOURCE"],
  avatar: "https://i.pravatar.cc/120?img=12",
  globalRank: "#128",
  developerLevel: "LVL 42",
};


const ACTIVE_MODULE = {
  title: "Advanced System Design",
  progress: 75,
  description:
    "Mastering high-availability systems, sharding strategies, and multi-region deployment. Currently exploring Byzantine Fault Tolerance.",
  nextUp: "DISTRIBUTED CONSENSUS",
};

const SHARED_RESOURCES = {
  activeAssets: 14,
  items: [
    { name: "System Design PDF", stat: "2.4k views" },
    { name: "Node.js Auth Boilerplate", stat: "1.1k stars" },
  ],
};

const EXPERIENCE = [
  {
    role: "Senior Developer @ TechEdu",
    period: "2021 — Present",
    desc: "Leading the migration of core services to microservices architecture using Node.js and AWS.",
    active: true,
  },
  {
    role: "Full Stack Intern @ DevStudio",
    period: "2020 — 2021",
    desc: "Collaborated on building a real-time collaborative code editor with Socket.io.",
    active: false,
  },
];
const EDUCATION = [
  {
    role: "Bachelor of Science in Computer Science",
    period: "2018 — 2022",
    desc: "Specialized in Software Engineering and Data Structures.",
    active: false,
  },
];
const RUNNING_COURSES = [
  { title: "Compiler Design", progress: 40, color: "#bc8cff" },
  { title: "Distributed Databases", progress: 12, color: "#3fb950" },
  ];


const ARCHIVED_COURSES = [
  { title: "Full Stack Mastery: Node.js", date: "OCT 12, 2023" },
];

const HEATMAP_DATA = Array.from({ length: 52 * 7 }, () =>
  Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 1 : 0
);




// ─── Root Dashboard Panel ─────────────────────────────────────────────────

export default function DashboardPanel() {
const { getProfileData, saveProfileData, updateProfileImageData,getMaxStreakData,deleteEducationData,getSharedResourcesCount ,fetchRank,userModules} = useProfile();
const [profileData, setProfileData] = useState('');
const [refreshing, setRefreshing] = useState(false);
const [imageUploading, setImageUploading] = useState(false);
const [rankData, setRankData] = useState({rank: -1, xp: 0});

//Profile Data fetching and updating logic
useEffect(() => {


  const fetchData = async () => {
    try {
      const response = await getProfileData(); 

      setProfileData(response.userProfile);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  fetchData();
}, [refreshing]);

useEffect(() => {
  const fetchRankData = async () => {
    console.log("Fetching rank data...");
    try {
      const response = await fetchRank();
      setRankData(response);
    } catch (error) {
      console.error(error);
    }
  };

  fetchRankData();
}, []);
console.log("Rank data in Profile component:", rankData);
console.log("User modules in Profile component:", userModules);

const handleEdit = (updatedData) => {

  saveProfileData(updatedData);
  setProfileData(updatedData); 
};

const handleImageSave = async(updatedImage) => {
  setImageUploading(true);
  const res= await updateProfileImageData(updatedImage);
  setRefreshing(prev => !prev);
  setImageUploading(false);
  
  };

const handleAddEducation = (newEducation) => {
 
  const updatedEducation = [...profileData.education, newEducation];
  const updatedProfile = { ...profileData, education: updatedEducation };
  saveProfileData(updatedProfile);
  setProfileData(updatedProfile); 

   // Close the modal after saving
};
const handleEditEducation = (updatedEducation,idx) => {
  console.log("handleEditEducation called with:", updatedEducation);

  const updatedEducationList = profileData.education.map((edu, index) =>
    index === idx ? {...updatedEducation } : edu
  );

  console.log("Updated education list:", updatedEducationList);
  const updatedProfile = {
    ...profileData,
    education: updatedEducationList,
  };

  saveProfileData(updatedProfile);
  setProfileData(updatedProfile);
};

const handleDeleteEducation = async (educationId) => {
 try{
    // await deleteEducationData(educationId);
    const updatedEducationList = profileData.education.filter(edu => edu._id !== educationId);
    const updatedProfile = { ...profileData, education: updatedEducationList };
    setProfileData(updatedProfile); 
    saveProfileData(updatedProfile);
  } catch (error) {
    console.error("Error deleting education:", error);
  }
};

const handleAddExperience = (newExperience) => {
  const updatedExperience = [...profileData.experience, newExperience];
  const updatedProfile = { ...profileData, experience: updatedExperience };
  saveProfileData(updatedProfile);
  setProfileData(updatedProfile);
};

const handleEditExperience = (updatedExperience,idx) => {

  console.log("handleEditExperience called with:", updatedExperience, "at index:", idx);
  const updatedExperienceList = profileData.experience.map((exp, index) =>
    index === idx ? {...updatedExperience } : exp
  );
console.log("Updated experience list:", updatedExperienceList);
  const updatedProfile = {
    ...profileData,
    experience: updatedExperienceList,
  };

  saveProfileData(updatedProfile);
  setProfileData(updatedProfile);
};

const handleDeleteExperience =(exp, idx) => {
 try{
    // await deleteEducationData(educationId);
    const updatedExperienceList = profileData.experience.filter((e, i) => i !== idx);
    const updatedProfile = { ...profileData, experience: updatedExperienceList };
    setProfileData(updatedProfile); 
    saveProfileData(updatedProfile);
  } catch (error) {
    console.error("Error deleting experience:", error);
  }
};


console.log(rankData);
  
  const handleShare = () => alert("Share Console clicked");
  const handleContinue = () => alert("Continue Learning clicked");
  const handleViewResources = () => alert("View Resources clicked");

// Badges data And logic
const [maxStreak, setMaxStreak] = useState(0);
useEffect(() => {
  const fetchMaxStreak = async () => {
    try {
      const response = await getMaxStreakData(); 

      setMaxStreak(response.maxStreak);
    } catch (error) {
      console.error("Error fetching max streak:", error);
    }
  };

  fetchMaxStreak();
}, []);
   

// get shared resources data
const [sharedResourcesCount, setSharedResourcesCount] = useState(0);
const [latestSharedResource, setLatestSharedResource] = useState(null);
useEffect(() => {
  const fetchSharedResources = async () => {
    try {
      const response = await getSharedResourcesCount();
      // console.log("Shared resources count fetched in component:", response);
      setSharedResourcesCount(response.resourcesCount);
      setLatestSharedResource(response.latestResource);
    } catch (error) {
      console.error("Error fetching shared resources:", error);
    }
  };


  fetchSharedResources();
}, []);

  return (
    <div className="w-full h-[93vh] overflow-hidden">
      <div
        className="h-full overflow-y-auto px-2 md:px-4 py-6 sm:py-8
        scrollbar-thin scrollbar-thumb-indigo-500/30 scrollbar-track-transparent"
      >
    <div className="w-full min-w-0 h-full px-3 space-y-4">

          {/* 1. Profile Header */}
          <ProfileHeader
            data={profileData} // ✅ fallback to static data
            onEdit={handleEdit}
            onImageSave={handleImageSave}
            onShare={handleShare}
            isImageUploading={imageUploading}
          />

          {/* 2. Earned Badges */}
          <EarnedBadges maxStreak={maxStreak}  />

          {/* 3. Stats + Active Module side by side on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-4">
              <StatsRow
                rankData={rankData}
              />
              <SharedResources
                data={SHARED_RESOURCES}
                latestResource={latestSharedResource}
                count={sharedResourcesCount}
              />
            </div>
            <div className="lg:col-span-2 flex flex-col gap-4">
              <ActiveModule module={userModules} onContinue={handleContinue} />
              <CourseProgress
                courses={userModules}
                // archived={ARCHIVED_COURSES}
              />
            </div>
          </div>

          {/* 4. Education Portfolio full width */}
          <ExperiencePortfolio experiences={profileData.experience || [] } onSave={handleAddExperience} onEdit={handleEditExperience} onDelete={handleDeleteExperience} />
          <EducationPortfolio education={profileData.education || []} onSave={handleAddEducation} onEdit={handleEditEducation} onDelete={handleDeleteEducation} />

          {/* 5. Knowledge Heatmap */}
          {/* <KnowledgeHeatmap data={HEATMAP_DATA} /> */}
        </div>
        </div>
      </div>
   
  );
}