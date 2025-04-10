import { api } from "./base.api";
import { BlogResponse } from "@/lib/types/response.type";

export const allBlogResponses = async (): Promise<BlogResponse[] | null> => {
  try {
    const config = {
      method: "GET",
      url: `/blogs`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await api<BlogResponse[]>(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error("Error getting all BlogResponses:", error);
    throw error;
  }
};

export default allBlogResponses;
