import { api } from "./base.api";
import { SearchResponse } from "@/lib/types/response.type";

interface SearchParams {
  query?: string | null;
  page?: number;
  tag?: string;
  type?: string;
  courseId?: string;
}

const searchData = async (params: SearchParams = {}) => {
  try {
        const response = await api
            .get<SearchResponse>("/materials/search", {
                params: {
                    query: params.query || "",
                    page: params.page || 1,
                    tag: params.tag || "",
                    type: params.type || "",
                    courseId: params.courseId || "",
                },
            });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Search error:", error);
        throw error;
    }
};

export default searchData;
