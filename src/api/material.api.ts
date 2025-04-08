import { api } from "./base.api";
import { Response, Material, Collection } from "@/lib/types/response.type";

interface GetMaterialsOptions {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  levelId?: string;
}

interface MaterialsResponse {
  data: Material[];
  meta?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export const getMaterials = async (
  options: GetMaterialsOptions = {}
): Promise<MaterialsResponse | null> => {
  try {
    const { page = 1, limit = 10, search, departmentId, levelId } = options;

    const params: Record<string, string | number> = {
      page,
      limit,
    };

    if (search) params.search = search;
    if (departmentId) params.departmentId = departmentId;
    if (levelId) params.levelId = levelId;

    const response = await api.get<Response<Material[]>>("/material", {
      params,
    });

    if (response.data.status === "success") {
      return {
        data: response.data.data,
        meta: response.data.meta,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching materials:", error);
    return null;
  }
};

export const getMaterial = async (id: string): Promise<Material | null> => {
  try {
    const response = await api.get<Response<Material>>(`/material/${id}`);

    if (response.data.status === "success") {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching material with id ${id}:`, error);
    return null;
  }
};

export const getCollections = async (): Promise<Collection[] | null> => {
  try {
    const response = await api.get<Response<Collection[]>>("/collections");

    if (response.data.status === "success") {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching collections:", error);
    return null;
  }
};

export const getCollection = async (id: string): Promise<Collection | null> => {
  try {
    const response = await api.get<Response<Collection>>(`/collections/${id}`);

    if (response.data.status === "success") {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching collection with id ${id}:`, error);
    return null;
  }
};
