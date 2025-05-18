"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import {
  AlertTriangle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ApprovalStatusEnum, Material } from "@/lib/types/response.type";
import {
  getMaterialReviews,
  reviewMaterial,
  deleteMaterialAsAdmin,
  ReviewActionDTO,
  getMaterialReviewCounts,
  ReviewCounts,
} from "@/api/review.api";
import ReviewTabs from "@/components/management/ReviewTabs";
import ReviewActionDialog from "@/components/management/ReviewActionDialog";
import DeleteConfirmationDialog from "@/components/management/DeleteConfirmationDialog";
import toast from "react-hot-toast";
import Link from "next/link";
import MaterialDetail from "@/components/materials/MaterialDetail";

const MaterialsReviewPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(
    ApprovalStatusEnum.PENDING
  );
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [viewingMaterial, setViewingMaterial] = useState<Material | null>(null);

  // Dialog states
  const [reviewAction, setReviewAction] = useState<ApprovalStatusEnum | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Counters for tabs
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Redirect if not admin or moderator
  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "moderator") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Fetch materials when tab changes or pagination changes
  useEffect(() => {
    fetchMaterials();
  }, [activeTab, currentPage]);

  // Fetch counts using new endpoint
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await getMaterialReviewCounts();
        if (response?.status === "success") {
          setCounts(response.data);
        }
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };

    fetchCounts();
  }, []); // Only fetch once on mount

  const fetchMaterials = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMaterialReviews({
        status: activeTab as ApprovalStatusEnum,
        page: currentPage,
        limit: 10,
        query: searchQuery || undefined,
      });

      if (response?.status === "success") {
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1); // Reset to first page on tab change
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchMaterials();
  };

  const handleReviewAction = (
    material: Material,
    action: ApprovalStatusEnum
  ) => {
    setSelectedMaterial(material);
    setReviewAction(action);
  };

  const handleDeleteAction = (material: Material) => {
    setSelectedMaterial(material);
    setIsDeleteDialogOpen(true);
  };

  const handleMaterialClick = (material: Material) => {
    setViewingMaterial(material);
  };

  const confirmReviewAction = async (
    action: ApprovalStatusEnum,
    comment: string
  ) => {
    if (!selectedMaterial) return;

    try {
      const reviewData: ReviewActionDTO = {
        action,
        comment: comment.trim() || undefined,
      };

      const response = await reviewMaterial(selectedMaterial.id, reviewData);

      if (response?.status === "success") {
        toast.success(
          `Material has been ${
            action === ApprovalStatusEnum.APPROVED ? "approved" : "rejected"
          }`
        );

        // Update counts locally
        setCounts((prev) => ({
          ...prev,
          pending: Math.max(0, prev.pending - 1),
          [action === ApprovalStatusEnum.APPROVED ? "approved" : "rejected"]:
            prev[
              action === ApprovalStatusEnum.APPROVED ? "approved" : "rejected"
            ] + 1,
        }));

        fetchMaterials();
      } else {
        toast.error("Action failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during review action:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const confirmDelete = async () => {
    if (!selectedMaterial || user?.role !== "admin") return;

    try {
      const response = await deleteMaterialAsAdmin(selectedMaterial.id);

      if (response?.status === "success") {
        toast.success("Material has been deleted");

        // Update counts based on current tab
        setCounts((prev) => ({
          ...prev,
          [activeTab.toLowerCase()]: Math.max(
            0,
            prev[activeTab.toLowerCase() as keyof ReviewCounts] - 1
          ),
        }));

        fetchMaterials();
      } else {
        toast.error("Failed to delete material");
      }
    } catch (error) {
      console.error("Error deleting material:", error);
      toast.error("An error occurred while deleting material");
    }
  };

  return (
    <div className="mx-auto max-w-full">
      <div className="flex justify-between items-center mb-3 sm:mb-6">
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">
          Materials Review
        </h1>
      </div>

      <div className="mb-4">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
          <Input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 max-w-full md:max-w-md"
          />
          <Button type="submit" size="sm" className="whitespace-nowrap">
            <Search className="mr-1 w-4 h-4" />
            Search
          </Button>
        </form>
      </div>

      <ReviewTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        pendingCount={counts.pending}
        approvedCount={counts.approved}
        rejectedCount={counts.rejected}
      >
        <div className="space-y-3 sm:space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-10 sm:py-20">
              <Loader2 className="w-6 sm:w-8 h-6 sm:h-8 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-3 sm:p-4 rounded-md text-red-500">
              <p>{error}</p>
            </div>
          ) : materials.length === 0 ? (
            <div className="bg-gray-50 p-4 sm:p-8 rounded-md text-center">
              <div className="flex justify-center mb-3">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-700 text-lg">
                No materials found
              </h3>
              <p className="mt-1 text-gray-500 text-sm">
                {activeTab === ApprovalStatusEnum.PENDING
                  ? "There are no materials waiting for review."
                  : activeTab === ApprovalStatusEnum.APPROVED
                    ? "There are no approved materials yet."
                    : "There are no rejected materials."}
              </p>
            </div>
          ) : (
            <>
              <div className="gap-3 sm:gap-4 grid grid-cols-1">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="bg-white shadow-sm hover:shadow-md p-3 sm:p-4 border rounded-lg transition-shadow"
                  >
                    <div className="flex sm:flex-row flex-col justify-between sm:items-start gap-3 sm:gap-4">
                      {/* Material Info */}
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Badge
                            variant={
                              material.reviewStatus ===
                              ApprovalStatusEnum.PENDING
                                ? "outline"
                                : material.reviewStatus ===
                                    ApprovalStatusEnum.APPROVED
                                  ? "default"
                                  : "destructive"
                            }
                            className="text-xs capitalize"
                          >
                            {material.reviewStatus}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {material.type}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-white border-gray-200 text-gray-600 text-xs"
                          >
                            {new Date(material.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                        <h3 className="mb-1 font-semibold text-sm sm:text-base">
                          {material.label}
                        </h3>
                        <p className="mb-1 sm:mb-2 text-gray-500 text-xs sm:text-sm">
                          by {material.creator.firstName}{" "}
                          {material.creator.lastName} (
                          {material.creator.username})
                        </p>
                        <p className="mb-1 sm:mb-2 text-gray-700 text-xs sm:text-sm line-clamp-2">
                          {material.description || "No description provided."}
                        </p>
                        {material.tags && (
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                            {material.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {material.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{material.tags.length - 2}
                              </Badge>
                            )}
                            {material.targetCourse && (
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs"
                              >
                                {material.targetCourse.courseCode}
                              </Badge>
                            )}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 sm:h-8 text-xs sm:text-sm"
                            onClick={() => handleMaterialClick(material)}
                          >
                            <Eye className="mr-1 w-3 sm:w-4 h-3 sm:h-4" />
                            View
                          </Button>
                          {activeTab === ApprovalStatusEnum.PENDING && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 h-7 sm:h-8 text-xs sm:text-sm"
                                onClick={() =>
                                  handleReviewAction(
                                    material,
                                    ApprovalStatusEnum.APPROVED
                                  )
                                }
                              >
                                <CheckCircle className="mr-1 w-3 sm:w-4 h-3 sm:h-4" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="h-7 sm:h-8 text-xs sm:text-sm"
                                onClick={() =>
                                  handleReviewAction(
                                    material,
                                    ApprovalStatusEnum.REJECTED
                                  )
                                }
                              >
                                <XCircle className="mr-1 w-3 sm:w-4 h-3 sm:h-4" />
                                Reject
                              </Button>
                            </>
                          )}
                          {user?.role === "admin" && (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-7 sm:h-8 text-xs sm:text-sm"
                              onClick={() => handleDeleteAction(material)}
                            >
                              <Trash2 className="mr-1 w-3 sm:w-4 h-3 sm:h-4" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination controls */}
              <div className="flex xs:flex-row flex-col justify-between items-center gap-2 mt-4 pt-2 sm:pt-4">
                <p className="text-gray-600 text-xs sm:text-sm">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-2 sm:px-3 h-7 sm:h-8 text-xs sm:text-sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="mr-1 w-3 sm:w-4 h-3 sm:h-4" />{" "}
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-2 sm:px-3 h-7 sm:h-8 text-xs sm:text-sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    Next <ChevronRight className="ml-1 w-3 sm:w-4 h-3 sm:h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </ReviewTabs>

      {viewingMaterial && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50">
          <div className="bg-white shadow-xl m-4 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <MaterialDetail
              materialId={viewingMaterial.id}
              isOwner={false}
              onClose={() => setViewingMaterial(null)}
            />
          </div>
        </div>
      )}

      {/* Review action dialog */}
      {selectedMaterial && reviewAction && (
        <ReviewActionDialog
          isOpen={!!reviewAction}
          onClose={() => setReviewAction(null)}
          onConfirm={confirmReviewAction}
          action={reviewAction}
          contentType="Material"
        />
      )}

      {/* Delete confirmation dialog */}
      {selectedMaterial && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          contentType="Material"
          itemName={selectedMaterial.label}
        />
      )}
    </div>
  );
};

export default MaterialsReviewPage;
