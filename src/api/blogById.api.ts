import { api } from "./base.api";
import { Blog, Response } from "@/lib/types/response.type";

const getBlogById = async (blogId: string): Promise<Blog> => {
  try {
    const response = await api.get<Response<Blog>>(`/blogs/${blogId}`);

    if (response.data.status === "success") {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to fetch blog details");
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

export default getBlogById;
