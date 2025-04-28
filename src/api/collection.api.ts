import { api } from "./base.api";
import { Response, Collection, Material } from "@/lib/types/response.type";

// Types for collection operations
export interface CreateCollectionDto {
  label: string;
  description?: string;
  visibility?: "public" | "private";
  targetCourseId?: string;
}

export interface UpdateCollectionDto extends Partial<CreateCollectionDto> {}

// Create a new collection
export const createCollection = async (
  collectionData: CreateCollectionDto
): Promise<Response<Collection>> => {
  try {
    const response = await api.post<Response<Collection>>(
      "/collections",
      collectionData
    );

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to create collection");
  } catch (error: any) {
    console.error("Error creating collection:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Get all collections for the current user
export const getMyCollections = async (): Promise<Response<Collection[]>> => {
  try {
    const response = await api.get<Response<Collection[]>>("/collections");

    return response.data;
  } catch (error: any) {
    console.error("Error fetching collections:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Get a single collection by ID
export const getCollection = async (
  id: string
): Promise<Response<Collection>> => {
  try {
    const response = await api.get<Response<Collection>>(`/collections/${id}`);

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to fetch collection");
  } catch (error: any) {
    console.error(`Error fetching collection with ID ${id}:`, error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Get collections by creator ID
export const getCollectionsByCreator = async (
  creatorId: string
): Promise<Response<Collection[]>> => {
  try {
    const response = await api.get<Response<Collection[]>>(
      `/collections/by-creator/${creatorId}`
    );

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(
      response.data.message || "Failed to fetch creator's collections"
    );
  } catch (error: any) {
    console.error(
      `Error fetching collections for creator ${creatorId}:`,
      error
    );
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Update a collection
export const updateCollection = async (
  id: string,
  updateData: UpdateCollectionDto
): Promise<Response<Collection>> => {
  try {
    const response = await api.patch<Response<Collection>>(
      `/collections/${id}`,
      updateData
    );

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to update collection");
  } catch (error: any) {
    console.error(`Error updating collection with ID ${id}:`, error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Delete a collection
export const deleteCollection = async (
  id: string
): Promise<Response<{ id: string }>> => {
  try {
    const response = await api.delete<Response<{ id: string }>>(
      `/collections/${id}`
    );

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to delete collection");
  } catch (error: any) {
    console.error(`Error deleting collection with ID ${id}:`, error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Add material to collection
export const addMaterialToCollection = async (
  collectionId: string,
  materialId: string
): Promise<Response<{ id: string }>> => {
  try {
    const response = await api.post<Response<{ id: string }>>(
      `/collections/${collectionId}/materials`,
      { materialId }
    );

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(
      response.data.message || "Failed to add material to collection"
    );
  } catch (error: any) {
    console.error("Error adding material to collection:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Remove material from collection
export const removeMaterialFromCollection = async (
  collectionId: string,
  materialId: string
): Promise<Response<{ id: string }>> => {
  try {
    const response = await api.delete<Response<{ id: string }>>(
      `/collections/${collectionId}/materials/${materialId}`
    );

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(
      response.data.message || "Failed to remove material from collection"
    );
  } catch (error: any) {
    console.error("Error removing material from collection:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Add nested collection
export const addNestedCollection = async (
  parentId: string,
  childId: string
): Promise<Response<{ id: string }>> => {
  try {
    const response = await api.post<Response<{ id: string }>>(
      `/collections/${parentId}/collections`,
      { collectionId: childId }
    );

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to add nested collection");
  } catch (error: any) {
    console.error("Error adding nested collection:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Remove nested collection
export const removeNestedCollection = async (
  parentId: string,
  childId: string
): Promise<Response<{ id: string }>> => {
  try {
    const response = await api.delete<Response<{ id: string }>>(
      `/collections/${parentId}/collections/${childId}`
    );

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(
      response.data.message || "Failed to remove nested collection"
    );
  } catch (error: any) {
    console.error("Error removing nested collection:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

export const processCollectionContent = (
  collection: Collection
): {
  materials: Material[];
  nestedCollections: Collection[];
} => {
  const materials: Material[] = [];
  const nestedCollections: Collection[] = [];

  if (!collection.content) {
    return { materials, nestedCollections };
  }
  collection.content.forEach((content) => {
    if (content.material) {
      materials.push(content.material);
    } else if (content.nestedCollection) {
      nestedCollections.push(content.nestedCollection);
    }
  });
  return { materials, nestedCollections };
};
