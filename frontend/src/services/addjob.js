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
    console.log("Updating job with ID:", jobId);
    console.log("Sending jobData:", jobData);

    const response = await fetch(`${API_URL}/update-job/${jobId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    });

    const textResponse = await response.text(); // Read as text first
    console.log("Raw Response:", textResponse); // Debugging

    // Convert to JSON only if it's valid JSON
    const jsonResponse = JSON.parse(textResponse);
    return jsonResponse;
  } catch (error) {
    console.error("Error updating job:", error);
    return { success: false, error: error.message };
  }
};
