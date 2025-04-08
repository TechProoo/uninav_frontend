import { api } from "./base.api";
import { Response, Advert, Pagination } from "@/lib/types/response.type";

// Types for advert creation
export interface CreateFreeAdvertDto {
  label: string;
  description?: string;
  materialId?: string;
  collectionId?: string;
  image?: File;
}

// Create Free Advert
export const createFreeAdvert = async (
  advertData: CreateFreeAdvertDto
): Promise<Response<Advert> | null> => {
  try {
    const formData = new FormData();

    // Add text fields
    Object.entries(advertData).forEach(([key, value]) => {
      if (key !== "image" && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    // Add image if present
    if (advertData.image) {
      formData.append("image", advertData.image);
    }

    const response = await api.post<Response<Advert>>(
      "/adverts/free-advert",
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
    console.error("Error creating free advert:", error);
    return null;
  }
};

// Get All Adverts
export const getAllAdverts = async (): Promise<Response<Advert[]> | null> => {
  try {
    const response = await api.get<Response<Advert[]>>("/adverts");

    if (response.data.status === "success") {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching adverts:", error);
    return null;
  }
};

// Get Advert by ID
export const getAdvertById = async (
  advertId: string
): Promise<Response<Advert> | null> => {
  try {
    const response = await api.get<Response<Advert>>(`/adverts/${advertId}`);

    if (response.data.status === "success") {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching advert with ID ${advertId}:`, error);
    return null;
  }
};

// Update Advert
export const updateAdvert = async (
  advertId: string,
  data: Partial<CreateFreeAdvertDto>
): Promise<Response<Advert> | null> => {
  try {
    const formData = new FormData();

    // Add text fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "image" && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    // Add image if present
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await api.patch<Response<Advert>>(
      `/adverts/${advertId}`,
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
    console.error(`Error updating advert with ID ${advertId}:`, error);
    return null;
  }
};

// Delete Advert
export const deleteAdvert = async (
  advertId: string
): Promise<Response<Advert> | null> => {
  try {
    const response = await api.delete<Response<Advert>>(`/adverts/${advertId}`);

    if (response.data.status === "success") {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(`Error deleting advert with ID ${advertId}:`, error);
    return null;
  }
};

// Get Advert by Material ID
export const getAdvertByMaterialId = async (
  materialId: string
): Promise<Response<Advert[]> | null> => {
  try {
    const response = await api.get<Response<Advert[]>>(
      `/adverts/material/${materialId}`
    );

    if (response.data.status === "success") {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching adverts for material ${materialId}:`, error);
    return null;
  }
};

// Get Advert by Collection ID
export const getAdvertByCollectionId = async (
  collectionId: string
): Promise<Response<Advert[]> | null> => {
  try {
    const response = await api.get<Response<Advert[]>>(
      `/adverts/collection/${collectionId}`
    );

    if (response.data.status === "success") {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(
      `Error fetching adverts for collection ${collectionId}:`,
      error
    );
    return null;
  }
};

// Get My Adverts
export const getMyAdverts = async (): Promise<Response<Advert[]> | null> => {
  try {
    const response = await api.get<Response<Advert[]>>("/adverts/me");

    if (response.data.status === "success") {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching your adverts:", error);
    return null;
  }
};

// Get Adverts by Creator ID
export const getAdvertsByCreatorId = async (
  creatorId: string
): Promise<Response<Advert[]> | null> => {
  try {
    const response = await api.get<Response<Advert[]>>(
      `/adverts/user/${creatorId}`
    );

    if (response.data.status === "success") {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching adverts for creator ${creatorId}:`, error);
    return null;
  }
};
