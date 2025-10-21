const API_BASE = import.meta.env.VITE_API_BASE;

/**
 * Submit a report about a user
 * @param {Object} reportData
 * @param {number} reportData.reported_user_id - The user being reported
 * @param {number} reportData.reporter_user_id - The clinic (or reporter) ID
 * @param {string} reportData.evidence_text - The reason / description
 * @param {File[]} [reportData.evidence_images] - Array of image files (optional)
 */
export const postReport = async (reportData) => {
  const {
    reported_user_id,
    reporter_user_id,
    evidence_text,
    evidence_images = [],
  } = reportData;

  const formData = new FormData();
  formData.append("reported_user_id", reported_user_id);
  formData.append("reporter_user_id", reporter_user_id);
  formData.append("evidence_text", evidence_text);

  evidence_images.forEach((file) => {
    formData.append("evidence_images", file);
  });

  const res = await fetch(`${API_BASE}/reports`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to submit report");
  }

  return await res.json();
};
