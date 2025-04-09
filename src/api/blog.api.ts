import { api } from "./base.api";
import { Blog } from "@/lib/types/response.type";

export const createBlog = async (fileInput: FormData): Promise<Blog | null> => {
  try {
    const config = {
      method: "POST",
      url: "/blogs",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: fileInput,
    };

    const response = await api<Blog>(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error("Error during blog creation:", error);
    throw error;
  }
};

export default createBlog;
