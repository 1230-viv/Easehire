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
      const response = await fetch(`http://127.0.0.1:5000/delete-employee/${employeeId}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
      }

      return await response.json();
  } catch (error) {
      console.error("Error deleting employee:", error.message);
      throw error;
  }
};
