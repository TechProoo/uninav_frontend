import { api } from "./base.api";
import { Response, Material, Pagination } from "@/lib/types/response.type";

export const fetchRecommendedMaterials = async ({
  page = 1,
  limit = 6,
}: {
  page?: number;
  limit?: number;
}): Promise<Response<Pagination<Material[]>> | null> => {
  try {
    const response = await api.get<Response<Pagination<Material[]>>>(
      `/materials/recommendations?page=${page}`
    );

    if (response.data.status === "success") {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching recommended materials:", error);
    return null;
  }
};
