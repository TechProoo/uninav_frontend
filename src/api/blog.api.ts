import { api } from "./base.api";
import { Content } from "@/lib/types/response.type";

export const createBlog = async (
  fileInput: FormData
): Promise<Content | null> => {
  try {
    const config = {
      method: "POST",
      url: "/blogs",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: fileInput,
    };

    const response = await api<Content>(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error("Error during blog creation:", error);
    throw error;
  }
};

export default createBlog;
