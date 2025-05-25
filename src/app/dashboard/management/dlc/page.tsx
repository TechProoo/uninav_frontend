"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import BackButton from "@/components/ui/BackButton";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  BookOpen,
  Building,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ApprovalStatusEnum, DLC } from "@/lib/types/response.type";
import {
  listDLCReviews,
  reviewDLC,
  deleteDLCAsAdmin,
  ReviewActionDTO,
  getDLCReviewCounts,
  ReviewCounts,
} from "@/api/review.api";
import ReviewTabs from "@/components/management/ReviewTabs";
import ReviewActionDialog from "@/components/management/ReviewActionDialog";
import DeleteConfirmationDialog from "@/components/management/DeleteConfirmationDialog";
import toast from "react-hot-toast";
import Link from "next/link";

const DLCReviewPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(
    ApprovalStatusEnum.PENDING
  );
  const [dlcs, setDLCs] = useState<DLC[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDLC, setSelectedDLC] = useState<DLC | null>(null);

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

  // Fetch DLCs when tab changes or pagination changes
  useEffect(() => {
    fetchDLCs();
  }, [activeTab, currentPage]);

  // Fetch counts using new endpoint
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await getDLCReviewCounts();
        if (response?.status === "success") {
          setCounts(response.data);
        }
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };

    fetchCounts();
  }, []); // Only fetch once on mount

  const fetchDLCs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await listDLCReviews({
        status: activeTab as ApprovalStatusEnum,
        page: currentPage,
        limit: 10,
        query: searchQuery || undefined,
      });

      if (response?.status === "success") {
        setDLCs(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError("Failed to load department level courses");
      }
    } catch (err) {
      console.error("Error fetching department level courses:", err);
      setError("An error occurred while loading department level courses");
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
    fetchDLCs();
  };

  const handleReviewAction = (dlc: DLC, action: ApprovalStatusEnum) => {
    setSelectedDLC(dlc);
    setReviewAction(action);
  };

  const handleDeleteAction = (dlc: DLC) => {
    setSelectedDLC(dlc);
    setIsDeleteDialogOpen(true);
  };

  const confirmReviewAction = async (
    action: ApprovalStatusEnum,
    comment: string
  ) => {
    if (!selectedDLC) return;

    try {
      const reviewData: ReviewActionDTO = {
        action,
        comment: comment.trim() || undefined,
      };

      const response = await reviewDLC(
        selectedDLC.departmentId,
        selectedDLC.courseId,
        reviewData
      );

      if (response?.status === "success") {
        toast.success(
          `Department Level Course has been ${
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

        fetchDLCs();
      } else {
        toast.error("Action failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during review action:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const confirmDelete = async () => {
    if (!selectedDLC || user?.role !== "admin") return;

    try {
      const response = await deleteDLCAsAdmin(
        selectedDLC.departmentId,
        selectedDLC.courseId
      );

      if (response?.status === "success") {
        toast.success("Department Level Course has been deleted");

        // Update counts based on current tab
        setCounts((prev) => ({
          ...prev,
          [activeTab.toLowerCase()]: Math.max(
            0,
            prev[activeTab.toLowerCase() as keyof ReviewCounts] - 1
          ),
        }));

        fetchDLCs();
      } else {
        toast.error("Failed to delete department level course");
      }
    } catch (error) {
      console.error("Error deleting department level course:", error);
      toast.error("An error occurred while deleting department level course");
    }
  };

  // If user not loaded yet or not admin/moderator, show nothing
  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return null;
  }

  return (
    <div className="mx-auto max-w-full">
      <div className="mb-4">
        <BackButton 
          onClick={() => router.push("/dashboard/management")} 
          label="Back to Management"
          className="mb-4"
        />
      </div>
      
      <div className="flex justify-between items-center mb-3 sm:mb-6">
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">
          DLC Review
        </h1>
      </div>

      <div className="mb-4">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
          <Input
            type="text"
            placeholder="Search DLCs..."
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
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-500">
              <p>{error}</p>
            </div>
          ) : dlcs.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-md text-center">
              <Award className="mx-auto mb-4 w-12 h-12 text-gray-400" />
              <h3 className="mb-2 font-medium text-xl">
                No department level courses found
              </h3>
              <p className="text-gray-500">
                {activeTab === ApprovalStatusEnum.PENDING
                  ? "There are no department level courses waiting for review."
                  : activeTab === ApprovalStatusEnum.APPROVED
                    ? "There are no approved department level courses."
                    : "There are no rejected department level courses."}
              </p>
            </div>
          ) : (
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {dlcs.map((dlc) => (
                <div
                  key={`${dlc.departmentId}-${dlc.courseId}`}
                  className="bg-white shadow-sm hover:shadow-md border rounded-lg overflow-hidden transition-shadow"
                >
                  <div className="p-6">
                    {/* Header with Icons */}
                    <div className="flex justify-between mb-4">
                      <div className="flex items-center">
                        <Building className="mr-2 w-5 h-5 text-blue-600" />
                        <span className="font-medium">Department</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700"
                      >
                        Level {dlc.level}
                      </Badge>
                    </div>

                    {/* Department Info */}
                    <div className="mb-4 pb-4 border-gray-100 border-b">
                      <h3 className="font-semibold text-lg">
                        {dlc.department.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {dlc.department.description ||
                          "No department description"}
                      </p>
                    </div>

                    {/* Course Info */}
                    <div className="flex items-center mb-2">
                      <GraduationCap className="mr-2 w-5 h-5 text-green-600" />
                      <span className="font-medium">Course</span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-semibold">
                          {dlc.course.courseName}
                        </h4>
                        <Badge className="bg-blue-100 text-blue-700 uppercase">
                          {dlc.course.courseCode}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {dlc.course.description || "No course description"}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end space-x-2 mt-4">
                      {activeTab === ApprovalStatusEnum.PENDING && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              handleReviewAction(
                                dlc,
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
                                dlc,
                                ApprovalStatusEnum.REJECTED
                              )
                            }
                          >
                            <XCircle className="mr-2 w-4 h-4" />
                            Reject
                          </Button>
                        </>
                      )}

                      {/* Delete button for admin only */}
                      {user.role === "admin" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteAction(dlc)}
                        >
                          <Trash2 className="mr-2 w-4 h-4" />
                          Delete
                        </Button>
                      )}
                    </div>

                    {/* Review info */}
                    {activeTab !== ApprovalStatusEnum.PENDING &&
                      dlc.reviewedById && (
                        <div className="mt-4 pt-4 border-gray-100 border-t">
                          <p className="text-sm">
                            {activeTab === ApprovalStatusEnum.APPROVED ? (
                              <span className="font-medium text-green-600">
                                Approved
                              </span>
                            ) : (
                              <span className="font-medium text-red-600">
                                Rejected
                              </span>
                            )}
                            {/* If reviewer info is available */}
                            {/* <span> by {dlc.reviewedBy?.username || "Admin"}</span> */}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination controls */}
          {dlcs.length > 0 && (
            <div className="flex justify-between items-center pt-8">
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
          )}
        </div>
      </ReviewTabs>

      {/* Review action dialog */}
      {selectedDLC && reviewAction && (
        <ReviewActionDialog
          isOpen={!!reviewAction}
          onClose={() => setReviewAction(null)}
          onConfirm={confirmReviewAction}
          action={reviewAction}
          contentType="Department Level Course"
        />
      )}

      {/* Delete confirmation dialog */}
      {selectedDLC && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          contentType="Department Level Course"
          itemName={`${selectedDLC.course.courseCode} for ${selectedDLC.department.name} (Level ${selectedDLC.level})`}
        />
      )}
    </div>
  );
};

export default DLCReviewPage;
