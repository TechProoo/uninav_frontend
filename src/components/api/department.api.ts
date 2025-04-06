import { api } from "./base.api";

export const getAllFaculty = async () => {
  try {
    const response = await api.get("/faculty");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching faculty:", error);
    throw new Error("Error finding faculty");
  }
};
