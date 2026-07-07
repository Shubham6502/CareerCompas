import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import ProfileHeader     from "../components/ProfileHeader.jsx";
import EarnedBadges      from "../components/EarnedBadges.jsx";
import StatsRow          from "../components/StatsRow.jsx";
import SharedResources   from "../components/SharedResources.jsx";
import ActiveModule      from "../components/ActiveModule.jsx";
import CourseProgress    from "../components/CourseProgress.jsx";
import ExperiencePortfolio from "../components/ExperiencePortfolio.jsx";
import EducationPortfolio  from "../components/EducationPortfolio.jsx";
import { useProfile }    from "../hooks/useProfile.js";

export default function DashboardPanel() {
  const {
    getProfileData, saveProfileData, updateProfileImageData,
    getMaxStreakData, getSharedResourcesCount, fetchRank, userModules,
    deleteEducationData,
  } = useProfile();

  const [profileData,      setProfileData]      = useState({});
  const [refreshing,       setRefreshing]        = useState(false);
  const [imageUploading,   setImageUploading]    = useState(false);
  const [rankData,         setRankData]          = useState({ rank: -1, xp: 0 });
  const [maxStreak,        setMaxStreak]         = useState(0);
  const [resourcesCount,   setResourcesCount]    = useState(0);
  const [latestResource,   setLatestResource]    = useState(null);

  // ── Data fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    getProfileData()
      .then(r => setProfileData(r.userProfile))
      .catch(e => console.error(e));
  }, [refreshing]);

  useEffect(() => {
    fetchRank().then(setRankData).catch(console.error);
    getMaxStreakData().then(r => setMaxStreak(r.maxStreak)).catch(console.error);
    getSharedResourcesCount()
      .then(r => { setResourcesCount(r.resourcesCount); setLatestResource(r.latestResource); })
      .catch(console.error);
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleEdit        = (d) => { saveProfileData(d); setProfileData(d); };
  const handleImageSave   = async (d) => {
    setImageUploading(true);
    await updateProfileImageData(d);
    setRefreshing(p => !p);
    setImageUploading(false);
  };

  const handleAddEdu      = (d) => { const u = { ...profileData, education: [...(profileData.education||[]), d] }; saveProfileData(u); setProfileData(u); };
  const handleEditEdu     = (d, idx) => { const list = (profileData.education||[]).map((e,i)=>i===idx?{...d}:e); const u={...profileData,education:list}; saveProfileData(u); setProfileData(u); };
  const handleDeleteEdu   = (id) => { const list=(profileData.education||[]).filter(e=>e._id!==id); const u={...profileData,education:list}; setProfileData(u); saveProfileData(u); };

  const handleAddExp      = (d) => { const u={...profileData,experience:[...(profileData.experience||[]),d]}; saveProfileData(u); setProfileData(u); };
  const handleEditExp     = (d, idx) => { const list=(profileData.experience||[]).map((e,i)=>i===idx?{...d}:e); const u={...profileData,experience:list}; saveProfileData(u); setProfileData(u); };
  const handleDeleteExp   = (exp, idx) => { const list=(profileData.experience||[]).filter((_,i)=>i!==idx); const u={...profileData,experience:list}; setProfileData(u); saveProfileData(u); };

  const handleShare    = () => alert("Share Console clicked");
  const handleContinue = () => alert("Continue Learning clicked");

  return (
    <div className="w-full h-[93vh] overflow-hidden">
      <div className="h-full overflow-y-auto px-3 sm:px-5 py-6
        scrollbar-thin scrollbar-thumb-indigo-500/30 scrollbar-track-transparent">

        <div className="w-full max-w-6xl mx-auto space-y-5 pb-8">

          {/* ── 1. Profile Header — full width ── */}
          <ProfileHeader
            data={profileData}
            onEdit={handleEdit}
            onImageSave={handleImageSave}
            onShare={handleShare}
            isImageUploading={imageUploading}
          />

          {/* ── 2. Badges strip — full width ── */}
          {/* <EarnedBadges maxStreak={maxStreak} /> */}

          {/* ── 3. Three-column section ── */}
          {/*
            Layout (lg+):
              col 1 (narrow): Stats + Shared Resources
              col 2-3 (wide): Active Module + Course Progress
            On mobile: stacks vertically
          */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left narrow column */}
            <div className="flex flex-col gap-4">
              <StatsRow rankData={rankData} />
              <SharedResources count={resourcesCount} latestResource={latestResource} />
            </div>

            {/* Right wide column — spans 2 grid columns */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <ActiveModule module={userModules} onContinue={handleContinue} />
              <CourseProgress courses={userModules || []} />
            </div>
          </div>

          {/* ── 4. Experience + Education side by side on lg ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ExperiencePortfolio
              experiences={profileData.experience || []}
              onSave={handleAddExp}
              onEdit={handleEditExp}
              onDelete={handleDeleteExp}
            />
            <EducationPortfolio
              education={profileData.education || []}
              onSave={handleAddEdu}
              onEdit={handleEditEdu}
              onDelete={handleDeleteEdu}
            />
          </div>

        </div>
      </div>
    </div>
  );
}