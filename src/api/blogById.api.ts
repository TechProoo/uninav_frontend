import { api } from "@/api/base.api"; // Adjust the import path as needed

const getBlogById = async (blogId: string) => {
  try {
    console.log(blogId)
    const response = await api.get(`/blogs/${blogId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    throw error;
  }
};

export default getBlogById;
