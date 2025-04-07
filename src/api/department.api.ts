import { api } from "./base.api";

export const getAllFaculty = async () => {
  try {
    const response = await api.get("/faculty");
    return response.data;
  } catch (error) {
    console.error("Error fetching faculties:", error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};
