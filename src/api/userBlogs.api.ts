import { api } from "@/api/base.api"; // Adjust the import path as needed

const getUserBlogs = async (creatorId: string | undefined) => {
  try {
    const response = await api.get(`/blogs/user/${creatorId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    throw error;
  }
};

export default getUserBlogs;
