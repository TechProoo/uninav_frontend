import { api } from "./base.api";
import { Response, Material, Pagination } from "@/lib/types/response.type";

// Types for material creation and update
export interface CreateMaterialDto {
  label: string;
  description?: string;
  type: string; // MaterialTypeEnum
  tags?: string[];
  visibility?: string; // VisibilityEnum
  restriction?: string; // RestrictionEnum
  targetCourse?: string;
  resourceAddress?: string;
  metaData?: string[];
  file?: File;
}

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

// List Materials with filtering
export const listMaterials = async ({
  page = 1,
  limit = 10,
  creatorId,
  courseId,
  type,
  tag,
}: {
  page?: number;
  limit?: number;
  creatorId?: string;
  courseId?: string;
  type?: string;
  tag?: string;
}): Promise<Response<Pagination<Material[]>> | null> => {
  try {
    let url = `/materials?page=${page}&limit=${limit}`;

    if (creatorId) url += `&creatorId=${creatorId}`;
    if (courseId) url += `&courseId=${courseId}`;
    if (type) url += `&type=${type}`;
    if (tag) url += `&tag=${tag}`;

    const response = await api.get<Response<Pagination<Material[]>>>(url);

    if (response.data.status === "success") {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching materials:", error);
    return null;
  }
};

// Search Materials
export const searchMaterials = async ({
  query,
  page = 1,
  limit = 10,
  creatorId,
  courseId,
  type,
  tag,
}: {
  query: string;
  page?: number;
  limit?: number;
  creatorId?: string;
  courseId?: string;
  type?: string;
  tag?: string;
}): Promise<Response<Pagination<Material[]>> | null> => {
  try {
    let url = `/materials/search?query=${encodeURIComponent(
      query
    )}&page=${page}&limit=${limit}`;

    if (creatorId) url += `&creatorId=${creatorId}`;
    if (courseId) url += `&courseId=${courseId}`;
    if (type) url += `&type=${type}`;
    if (tag) url += `&tag=${tag}`;

    const response = await api.get<Response<Pagination<Material[]>>>(url);

    if (response.data.status === "success") {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error searching materials:", error);
    return null;
  }
};

// Get Material By ID
export const getMaterialById = async (
  id: string
): Promise<Response<Material> | null> => {
  try {
    const response = await api.get<Response<Material>>(`/materials/${id}`);

    if (response.data.status === "success") {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching material with ID ${id}:`, error);
    return null;
  }
};

// Create Material
export const createMaterial = async (
  materialData: CreateMaterialDto
): Promise<Response<Material> | null> => {
  try {
    const formData = new FormData();

    // Add all text fields
    Object.entries(materialData).forEach(([key, value]) => {
      if (
        key !== "file" &&
        key !== "tags" &&
        key !== "metaData" &&
        value !== undefined
      ) {
        formData.append(key, value.toString());
      }
    });

    // Add arrays as JSON strings
    if (materialData.tags && materialData.tags.length > 0) {
      formData.append("tags", JSON.stringify(materialData.tags));
    }

    if (materialData.metaData && materialData.metaData.length > 0) {
      formData.append("metaData", JSON.stringify(materialData.metaData));
    }

    // Add file if present
    if (materialData.file) {
      formData.append("file", materialData.file);
    }

    const response = await api.post<Response<Material>>(
      "/materials",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.status === "success") {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error creating material:", error);
    return null;
  }
};

// Update Material
export const updateMaterial = async (
  id: string,
  materialData: Partial<CreateMaterialDto>
): Promise<Response<Material> | null> => {
  try {
    const formData = new FormData();

    // Add all text fields
    Object.entries(materialData).forEach(([key, value]) => {
      if (
        key !== "file" &&
        key !== "tags" &&
        key !== "metaData" &&
        value !== undefined
      ) {
        formData.append(key, value.toString());
      }
    });

    // Add arrays as JSON strings
    if (materialData.tags && materialData.tags.length > 0) {
      formData.append("tags", JSON.stringify(materialData.tags));
    }

    if (materialData.metaData && materialData.metaData.length > 0) {
      formData.append("metaData", JSON.stringify(materialData.metaData));
    }

    // Add file if present
    if (materialData.file) {
      formData.append("file", materialData.file);
    }

    const response = await api.patch<Response<Material>>(
      `/materials/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.status === "success") {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(`Error updating material with ID ${id}:`, error);
    return null;
  }
};

// Delete Material
export const deleteMaterial = async (
  id: string
): Promise<Response<{ id: string }> | null> => {
  try {
    const response = await api.delete<Response<{ id: string }>>(
      `/materials/${id}`
    );

    if (response.data.status === "success") {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(`Error deleting material with ID ${id}:`, error);
    return null;
  }
};

// Like/Unlike Material
export const toggleMaterialLike = async (
  id: string
): Promise<Response<{ liked: boolean; likesCount: number }> | null> => {
  try {
    const response = await api.post<
      Response<{ liked: boolean; likesCount: number }>
    >(`/materials/like/${id}`);

    if (response.data.status === "success") {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(`Error toggling like for material with ID ${id}:`, error);
    return null;
  }
};

// Get Download URL for Material
export const getMaterialDownloadUrl = async (
  id: string
): Promise<Response<{ url: string }> | null> => {
  try {
    const response = await api.get<Response<{ url: string }>>(
      `/materials/download/${id}`
    );

    if (response.data.status === "success") {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(
      `Error getting download URL for material with ID ${id}:`,
      error
    );
    return null;
  }
};

// Get Material Resource
export const getMaterialResource = async (
  materialId: string
): Promise<Response<{
  resourceType: string;
  resourceAddress: string;
  metaData: string[];
  fileKey: string;
}> | null> => {
  try {
    const response = await api.get<
      Response<{
        resourceType: string;
        resourceAddress: string;
        metaData: string[];
        fileKey: string;
      }>
    >(`/materials/resource/${materialId}`);

    if (response.data.status === "success") {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(
      `Error getting resource for material with ID ${materialId}:`,
      error
    );
    return null;
  }
};
