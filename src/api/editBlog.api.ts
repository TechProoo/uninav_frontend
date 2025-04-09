import { api } from "./base.api";
import { Blog } from "@/lib/types/response.type";

export const editBlog = async (
  fileInput: FormData,
  id: string
): Promise<Blog | null> => {
  try {
    const config = {
      method: "PATCH",
      url: `/blogs/${id}`,
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

export default editBlog;
