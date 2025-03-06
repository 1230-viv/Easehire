const API_URL = "http://127.0.0.1:5000"; // Backend URL

export const addJob = async (jobData) => {
  try {
    const response = await fetch(`${API_URL}/add-job`, {  // ✅ Fixed backticks
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    });

    return await response.json();
  } catch (error) {
    console.error("Error adding job:", error);
    return { success: false };
  }
};

export const fetchJobs = async () => {
  try {
    const response = await fetch(`${API_URL}/jobs`);  // ✅ Fixed backticks
    return await response.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

export const deleteJob = async (jobId) => {
  try {
    const response = await fetch(`${API_URL}/delete-job/${jobId}`, { method: "DELETE" });  // ✅ Fixed backticks
    return await response.json();
  } catch (error) {
    console.error("Error deleting job:", error);
    return { success: false };
  }
};

export const updateJob = async (jobId, jobData) => {
  try {
    const response = await fetch(`${API_URL}/update-job/${jobId}`, {  // ✅ Fixed backticks
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating job:", error);
    return { success: false };
  }
};
