"use client";

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/authContext";
import {
  PlusCircle,
  Search,
  Filter,
  BookOpen,
  Grid,
  List,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MaterialForm from "@/components/materials/forms/MaterialForm";
import MaterialDetail from "@/components/materials/MaterialDetail";
import MaterialGrid from "@/components/materials/MaterialGrid";
import { Material, MaterialTypeEnum } from "@/lib/types/response.type";
import { listMaterials, searchMaterials } from "@/api/material.api";

type ViewMode = "grid" | "list";

const MaterialsPage = () => {
  const { user } = useContext(AuthContext) ?? { user: null };
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [filterType, setFilterType] = useState<string>("");

  useEffect(() => {
    fetchMaterials();
  }, [page, filterType]);

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let response;

      if (searchQuery.trim()) {
        response = await searchMaterials({
          query: searchQuery,
          page,
          creatorId: user?.id,
          type: filterType || undefined,
        });
      } else {
        response = await listMaterials({
          page,
          creatorId: user?.id,
          type: filterType || undefined,
        });
      }

      if (response && response.status === "success") {
        setMaterials(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError("Failed to load materials");
      }
    } catch (err) {
      console.error("Error fetching materials:", err);
      setError("An error occurred while loading materials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMaterials();
  };

  const handleMaterialClick = (material: Material) => {
    setSelectedMaterial(material);
  };

  const handleAddMaterial = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    setSelectedMaterial(null);
  };

  const handleEditMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleDeleteMaterial = (materialId: string) => {
    setMaterials(materials.filter((m) => m.id !== materialId));
    setSelectedMaterial(null);
    setShowEditForm(false);
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleFormSuccess = (material: Material) => {
    setShowAddForm(false);
    setShowEditForm(false);
    fetchMaterials();
  };

  const isOwner = (material: Material) => {
    return user?.id === material.creatorId;
  };

  const handleBackNavigation = () => {
    if (showEditForm) {
      setShowEditForm(false);
      setSelectedMaterial((prev) => prev);
    } else if (selectedMaterial) {
      setSelectedMaterial(null);
    } else if (showAddForm) {
      setShowAddForm(false);
    }
  };

  return (
    <div className="mx-auto container">
      <div className="flex justify-between items-center mb-6">
        {showAddForm || showEditForm || selectedMaterial ? (
          <Button
            variant="ghost"
            className="gap-2"
            onClick={handleBackNavigation}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        ) : null}
        <h1 className="font-bold text-3xl">Manage My Materials</h1>
        <Button onClick={handleAddMaterial}>
          <PlusCircle className="mr-2 w-4 h-4" />
          Add Material
        </Button>
      </div>

      {!showAddForm && !showEditForm && !selectedMaterial && (
        <div className="flex md:flex-row flex-col gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex flex-grow md:max-w-md">
            <div className="relative w-full">
              <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="search"
                className="block p-2 pl-10 border border-gray-300 rounded-lg w-full text-sm"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="top-1 right-1 bottom-1 absolute bg-blue-600 px-3 rounded text-white text-sm"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Types</option>
              {Object.values(MaterialTypeEnum).map((type) => (
                <option key={type} value={type}>
                  {type.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md p-8 rounded-lg min-h-[500px]">
        {showAddForm && (
          <div className="mb-6">
            <h2 className="mb-4 font-medium text-2xl">Add New Material</h2>
            <MaterialForm
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        {showEditForm && selectedMaterial && (
          <div className="mb-6">
            <h2 className="mb-4 font-medium text-2xl">Edit Material</h2>
            <MaterialForm
              initialData={selectedMaterial}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        {!showAddForm && !showEditForm && selectedMaterial && (
          <MaterialDetail
            material={selectedMaterial}
            isOwner={isOwner(selectedMaterial)}
            onEdit={handleEditMaterial}
            onDelete={handleDeleteMaterial}
          />
        )}

        {!showAddForm && !showEditForm && !selectedMaterial && (
          <>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse">Loading materials...</div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded text-red-600">{error}</div>
            ) : materials.length === 0 ? (
              <div className="py-8 text-center">
                <BookOpen className="mx-auto w-12 h-12 text-gray-400" />
                <h3 className="mt-2 font-medium text-gray-900 text-lg">
                  No materials yet
                </h3>
                <p className="mt-1 text-gray-500">
                  Get started by adding your first material.
                </p>
                <div className="mt-6">
                  <Button onClick={handleAddMaterial}>
                    <PlusCircle className="mr-2 w-4 h-4" />
                    Add Material
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <MaterialGrid
                  materials={materials}
                  onMaterialClick={handleMaterialClick}
                  viewMode={viewMode}
                />

                {totalPages > 1 && (
                  <div className="flex justify-center gap-1 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="px-3 py-1.5 text-sm">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MaterialsPage;
