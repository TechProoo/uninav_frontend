"use client";

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/authContext";
import { PlusCircle, Search, Filter, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import MaterialForm from "@/components/materials/forms/MaterialForm";
import MaterialDetail from "@/components/materials/MaterialDetail";
import MaterialGrid from "@/components/materials/MaterialGrid";
import { Material, MaterialTypeEnum } from "@/lib/types/response.type";
import { searchMaterialsLoggedIn, getMyMaterials } from "@/api/material.api";
import { useRouter } from "next/navigation";

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

  const router = useRouter();
  useEffect(() => {
    fetchMaterials();
  }, [page, filterType]);

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let response;

      if (searchQuery.trim()) {
        response = await searchMaterialsLoggedIn({
          query: searchQuery,
          page,
          creatorId: user?.id,
          type: filterType || undefined,
        });
      } else {
        response = await getMyMaterials({
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
    router.push(`/material/${material.id}`);
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
    <div className="mx-auto px-2 sm:px-4 container">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3 sm:mb-6">
        {showAddForm || showEditForm || selectedMaterial ? (
          <Button
            variant="ghost"
            className="gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 h-auto text-xs sm:text-sm"
            onClick={handleBackNavigation}
          >
            <ArrowLeft className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            Back
          </Button>
        ) : null}
        <h1 className="font-bold text-lg sm:text-xl md:text-2xl">
          Manage My Materials
        </h1>
        <Button
          onClick={handleAddMaterial}
          className="px-2 sm:px-3 py-1 sm:py-2 h-8 sm:h-10 text-xs sm:text-sm"
        >
          <PlusCircle className="mr-1 sm:mr-2 w-3.5 sm:w-4 h-3.5 sm:h-4" />
          Add Material
        </Button>
      </div>

      {!showAddForm && !showEditForm && !selectedMaterial && (
        <div className="flex md:flex-row flex-col gap-2 sm:gap-3 mb-4 sm:mb-6">
          <form onSubmit={handleSearch} className="flex flex-grow md:max-w-md">
            <div className="relative w-full">
              <div className="left-0 absolute inset-y-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
                <Search className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-500" />
              </div>
              <input
                type="search"
                className="block px-2 sm:px-3 py-1.5 sm:py-2 pl-7 sm:pl-9 border border-gray-300 rounded-lg w-full text-xs sm:text-sm"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="top-1 right-1 bottom-1 absolute bg-blue-600 px-2 sm:px-3 rounded text-white text-xs sm:text-sm"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center gap-1 sm:gap-2 mt-2 md:mt-0">
            <Filter className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg w-full md:w-auto text-xs sm:text-sm"
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

      <div className="bg-white shadow-md p-3 sm:p-6 rounded-lg min-h-[400px] sm:min-h-[500px]">
        {showAddForm && (
          <div className="mb-4 sm:mb-6">
            <h2 className="mb-3 sm:mb-4 font-medium text-lg sm:text-xl">
              Add New Material
            </h2>
            <MaterialForm
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        {showEditForm && selectedMaterial && (
          <div className="mb-4 sm:mb-6">
            <h2 className="mb-3 sm:mb-4 font-medium text-lg sm:text-xl">
              Edit Material
            </h2>
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
              <div className="flex justify-center py-6 sm:py-8">
                <div className="text-sm sm:text-base animate-pulse">
                  Loading materials...
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-3 sm:p-4 rounded text-red-600 text-xs sm:text-sm">
                {error}
              </div>
            ) : materials.length === 0 ? (
              <div className="py-6 sm:py-8 text-center">
                <BookOpen className="mx-auto w-10 sm:w-12 h-10 sm:h-12 text-gray-400" />
                <h3 className="mt-2 font-medium text-gray-900 text-sm sm:text-lg">
                  No materials yet
                </h3>
                <p className="mt-1 text-gray-500 text-xs sm:text-sm">
                  Get started by adding your first material.
                </p>
                <div className="mt-4 sm:mt-6">
                  <Button
                    onClick={handleAddMaterial}
                    className="px-2 sm:px-3 py-1 sm:py-2 h-8 sm:h-10 text-xs sm:text-sm"
                  >
                    <PlusCircle className="mr-1 sm:mr-2 w-3.5 sm:w-4 h-3.5 sm:h-4" />
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
                  <div className="flex justify-center gap-1 sm:gap-2 mt-4 sm:mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="h-7 sm:h-8 text-xs sm:text-sm"
                    >
                      Previous
                    </Button>
                    <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={page === totalPages}
                      className="h-7 sm:h-8 text-xs sm:text-sm"
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
