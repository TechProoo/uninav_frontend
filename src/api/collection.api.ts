import { api } from "./base.api";
import { Collection, Response } from "@/lib/types/response.type";

export interface CreateCollectionDto {
  label: string;
  description: string;
  visibility: "public" | "private";
  creatorId?: string;
}

// Get all user collections
export const getCollections = async (): Promise<Response<
  Collection[]
> | null> => {
  try {
    const response = await api.get<Response<Collection[]>>("/collections");
    return response.data;
  } catch (error) {
    console.error("Error fetching collections:", error);
    return null;
  }
};

// Get collection by ID
export const getCollectionById = async (
  id: string
): Promise<Response<Collection> | null> => {
  try {
    const response = await api.get<Response<Collection>>(`/collections/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching collection:", error);
    return null;
  }
};

// Create collection
export const createCollection = async (
  data: CreateCollectionDto
): Promise<Response<Collection> | null> => {
  try {
    const response = await api.post<Response<Collection>>("/collections", data);
    return response.data;
  } catch (error) {
    console.error("Error creating collection:", error);
    return null;
  }
};

// Get collections by creator
export const getCollectionsByCreator = async (
  creatorId: string
): Promise<Response<Collection[]> | null> => {
  try {
    const response = await api.get<Response<Collection[]>>(
      `/collections/by-creator/${creatorId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching creator collections:", error);
    return null;
  }
};

// Add material to collection
export const addMaterialToCollection = async (
  collectionId: string,
  materialId: string
): Promise<Response<any> | null> => {
  try {
    const response = await api.post<Response<any>>(
      `/collections/${collectionId}/materials`,
      {
        materialId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding material to collection:", error);
    return null;
  }
};

// Remove material from collection
export const removeMaterialFromCollection = async (
  collectionId: string,
  materialId: string
): Promise<Response<any> | null> => {
  try {
    const response = await api.delete<Response<any>>(
      `/collections/${collectionId}/materials/${materialId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error removing material from collection:", error);
    return null;
  }
};

// Add nested collection
export const addNestedCollection = async (
  parentId: string,
  childId: string
): Promise<Response<any> | null> => {
  try {
    const response = await api.post<Response<any>>(
      `/collections/${parentId}/collections`,
      {
        collectionId: childId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error nesting collection:", error);
    return null;
  }
};

// Remove nested collection
export const removeNestedCollection = async (
  parentId: string,
  childId: string
): Promise<Response<any> | null> => {
  try {
    const response = await api.delete<Response<any>>(
      `/collections/${parentId}/collections/${childId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error removing nested collection:", error);
    return null;
  }
};
export const updateCollection = async (
  id: string,
  data: Partial<CreateCollectionDto>
): Promise<Response<Collection> | null> => {
  try {
    const response = await api.put<Response<Collection>>(
      `/collections/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating collection:", error);
    return null;
  }
};
