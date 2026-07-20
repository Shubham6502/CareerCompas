import CareerProfile from "./careerProfile.model.js";

export const updateUserStreak = async (userId) => {
  const profile = await CareerProfile.findOne({ userId, isDeleted: false });
  if (!profile) return null;

  const now = new Date();
  const todayStr = now.toLocaleDateString("en-CA"); // Normalized YYYY-MM-DD
  const today = new Date(todayStr);

  if (!profile.lastActiveDate) {
    profile.currentStreak = 1;
    profile.longestStreak = 1;
    profile.lastActiveDate = today;
  } else {
    const lastActiveStr = profile.lastActiveDate.toLocaleDateString("en-CA");
    const lastActive = new Date(lastActiveStr);

    const diffTime = today.getTime() - lastActive.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Active on consecutive day
      profile.currentStreak += 1;
      profile.longestStreak = Math.max(profile.longestStreak, profile.currentStreak);
      profile.lastActiveDate = today;
    } else if (diffDays > 1) {
      // Missed one or more days, reset streak to 1
      profile.currentStreak = 1;
      profile.lastActiveDate = today;
    }
    // If diffDays === 0, they already completed a task today, so streak remains unchanged
  }

  await profile.save();
  return profile;
};
