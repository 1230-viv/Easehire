const API_URL = "http://127.0.0.1:5000"; // Backend URL

export const addJob = async (jobData) => {
  try {
    const response = await fetch(`${API_URL}/add-job`, {
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
    const response = await fetch(`${API_URL}/jobs`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

export const deleteJob = async (jobId) => {
  try {
    const response = await fetch(`${API_URL}/delete-job/${jobId}`, { method: "DELETE" });
    return await response.json();
  } catch (error) {
    console.error("Error deleting job:", error);
    return { success: false };
  }
};
