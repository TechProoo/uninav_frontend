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
  listMaterialReviews,
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
      const response = await listMaterialReviews({
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

  // If user not loaded yet or not admin/moderator, show nothing
  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return null;
  }

  return (
    <div className="mx-auto px-4 container">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link href="/dashboard/management">
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
        </Button>
        <h1 className="font-bold text-3xl">Materials Review</h1>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="search"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <Button type="submit">
            <Search className="mr-2 w-4 h-4" />
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
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-500">
              <p>{error}</p>
            </div>
          ) : materials.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-md text-center">
              <BookOpen className="mx-auto mb-4 w-12 h-12 text-gray-400" />
              <h3 className="mb-2 font-medium text-xl">No materials found</h3>
              <p className="text-gray-500">
                {activeTab === ApprovalStatusEnum.PENDING
                  ? "There are no materials waiting for review."
                  : activeTab === ApprovalStatusEnum.APPROVED
                  ? "There are no approved materials."
                  : "There are no rejected materials."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="bg-white border rounded-lg overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex md:flex-row flex-col justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">
                          {material.label}
                        </h3>
                        <p className="mb-2 text-gray-500 text-sm">
                          by {material.creator.firstName}{" "}
                          {material.creator.lastName} (
                          {material.creator.username})
                        </p>
                        <p className="mb-2 text-gray-700">
                          {material.description || "No description provided."}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="secondary">{material.type}</Badge>
                          {material.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                          {material.targetCourse && (
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 hover:bg-blue-200 text-blue-700"
                            >
                              Course: {material.targetCourse.courseCode}
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm">
                          Created:{" "}
                          {new Date(material.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMaterialClick(material)}
                        >
                          <Eye className="mr-2 w-4 h-4" />
                          View
                        </Button>
                        {activeTab === ApprovalStatusEnum.PENDING && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() =>
                                handleReviewAction(
                                  material,
                                  ApprovalStatusEnum.APPROVED
                                )
                              }
                            >
                              <CheckCircle className="mr-2 w-4 h-4" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleReviewAction(
                                  material,
                                  ApprovalStatusEnum.REJECTED
                                )
                              }
                            >
                              <XCircle className="mr-2 w-4 h-4" />
                              Reject
                            </Button>
                          </>
                        )}
                        {user.role === "admin" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteAction(material)}
                          >
                            <Trash2 className="mr-2 w-4 h-4" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Additional material details */}
                    {activeTab !== ApprovalStatusEnum.PENDING &&
                      material.reviewedBy && (
                        <div className="bg-gray-50 mt-4 p-3 rounded-md">
                          <p className="font-medium text-sm">
                            {activeTab === ApprovalStatusEnum.APPROVED ? (
                              <span className="text-green-600">
                                Approved by:{" "}
                              </span>
                            ) : (
                              <span className="text-red-600">
                                Rejected by:{" "}
                              </span>
                            )}
                            {material.reviewedBy.firstName}{" "}
                            {material.reviewedBy.lastName}
                          </p>
                          {/* Show rejection comment if available */}
                          {/* This data structure might need adjustment based on actual API response */}
                          {material.reviewStatus ===
                            ApprovalStatusEnum.REJECTED && (
                            <p className="mt-1 text-sm">
                              <span className="font-medium">Reason: </span>
                              {
                                "Comment not available in current data structure"
                              }
                            </p>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              ))}

              {/* Pagination controls */}
              <div className="flex justify-between items-center pt-4">
                <p className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="mr-1 w-4 h-4" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    Next <ChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </ReviewTabs>

      {viewingMaterial && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50">
          <div className="bg-white shadow-xl m-4 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <MaterialDetail
              material={viewingMaterial}
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
