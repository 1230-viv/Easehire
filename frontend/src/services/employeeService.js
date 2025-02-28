const API_URL = "http://127.0.0.1:5000"; // Backend URL

export const fetchEmployees = async () => {
  try {
    const response = await fetch(`${API_URL}/employees`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};

export const deleteEmployee = async (employeeId) => {
  try {
    const response = await fetch(`${API_URL}/delete-employee/${employeeId}`, { method: "DELETE" });
    return await response.json();
  } catch (error) {
    console.error("Error deleting employee:", error);
    return { success: false };
  }
};
