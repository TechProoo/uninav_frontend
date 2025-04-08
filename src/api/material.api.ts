import { api } from "./base.api";
import { Response, Material } from "@/lib/types/response.type";

export const fetchRecommendedMaterials = async (): Promise<
  Material[] | null
> => {
  try {
    const response = await api.get<Response<Material[]>>(
      "/materials/recommendations"
    );

    if (response.data.status === "success") {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching recommended materials:", error);
    return null;
  }
};
