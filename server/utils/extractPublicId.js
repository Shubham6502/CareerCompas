// utils/extractPublicId.js
export const extractPublicId = (url) => {
  const parts = url.split("/");
  const uploadIndex = parts.findIndex(p => p === "upload");

  const publicIdWithExt = parts
    .slice(uploadIndex + 2)
    .join("/");

  return publicIdWithExt.replace(/\.[^/.]+$/, "");
};
