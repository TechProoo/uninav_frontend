"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import {
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ApprovalStatusEnum, Course } from "@/lib/types/response.type";
import {
  listCourseReviews,
  reviewCourse,
  deleteCourseAsAdmin,
  ReviewActionDTO,
} from "@/api/review.api";
import ReviewTabs from "@/components/management/ReviewTabs";
import ReviewActionDialog from "@/components/management/ReviewActionDialog";
import DeleteConfirmationDialog from "@/components/management/DeleteConfirmationDialog";
import toast from "react-hot-toast";
import Link from "next/link";

const CoursesReviewPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(
    ApprovalStatusEnum.PENDING
  );
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

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

  // Fetch courses when tab changes or pagination changes
  useEffect(() => {
    fetchCourses();
  }, [activeTab, currentPage]);

  // Fetch counts for each status
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
          listCourseReviews({
            status: ApprovalStatusEnum.PENDING,
            page: 1,
            limit: 1,
          }),
          listCourseReviews({
            status: ApprovalStatusEnum.APPROVED,
            page: 1,
            limit: 1,
          }),
          listCourseReviews({
            status: ApprovalStatusEnum.REJECTED,
            page: 1,
            limit: 1,
          }),
        ]);

        setCounts({
          pending: pendingRes?.data.pagination.total || 0,
          approved: approvedRes?.data.pagination.total || 0,
          rejected: rejectedRes?.data.pagination.total || 0,
        });
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };

    fetchCounts();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await listCourseReviews({
        status: activeTab as ApprovalStatusEnum,
        page: currentPage,
        limit: 10,
      });

      if (response?.status === "success") {
        setCourses(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError("Failed to load courses");
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("An error occurred while loading courses");
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
    // Implement search functionality - this would need to be added to the API
    fetchCourses();
  };

  const handleReviewAction = (course: Course, action: ApprovalStatusEnum) => {
    setSelectedCourse(course);
    setReviewAction(action);
  };

  const handleDeleteAction = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteDialogOpen(true);
  };

  const confirmReviewAction = async (
    action: ApprovalStatusEnum,
    comment: string
  ) => {
    if (!selectedCourse) return;

    try {
      const reviewData: ReviewActionDTO = {
        action,
        comment: comment.trim() || undefined,
      };

      const response = await reviewCourse(selectedCourse.id, reviewData);

      if (response?.status === "success") {
        toast.success(
          `Course has been ${
            action === ApprovalStatusEnum.APPROVED ? "approved" : "rejected"
          }`
        );

        // Update counts
        if (activeTab === ApprovalStatusEnum.PENDING) {
          setCounts((prev) => ({
            ...prev,
            pending: Math.max(0, prev.pending - 1),
            [action === ApprovalStatusEnum.APPROVED ? "approved" : "rejected"]:
              prev[
                action === ApprovalStatusEnum.APPROVED ? "approved" : "rejected"
              ] + 1,
          }));
        }

        fetchCourses();
      } else {
        toast.error("Action failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during review action:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const confirmDelete = async () => {
    if (!selectedCourse || user?.role !== "admin") return;

    try {
      const response = await deleteCourseAsAdmin(selectedCourse.id);

      if (response?.status === "success") {
        toast.success("Course has been deleted");

        // Update counts based on current tab
        if (activeTab === ApprovalStatusEnum.PENDING) {
          setCounts((prev) => ({
            ...prev,
            pending: Math.max(0, prev.pending - 1),
          }));
        } else if (activeTab === ApprovalStatusEnum.APPROVED) {
          setCounts((prev) => ({
            ...prev,
            approved: Math.max(0, prev.approved - 1),
          }));
        } else {
          setCounts((prev) => ({
            ...prev,
            rejected: Math.max(0, prev.rejected - 1),
          }));
        }

        fetchCourses();
      } else {
        toast.error("Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("An error occurred while deleting course");
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
        <h1 className="font-bold text-3xl">Courses Review</h1>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="search"
            placeholder="Search by course name or code..."
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
          ) : courses.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-md text-center">
              <GraduationCap className="mx-auto mb-4 w-12 h-12 text-gray-400" />
              <h3 className="mb-2 font-medium text-xl">No courses found</h3>
              <p className="text-gray-500">
                {activeTab === ApprovalStatusEnum.PENDING
                  ? "There are no courses waiting for review."
                  : activeTab === ApprovalStatusEnum.APPROVED
                  ? "There are no approved courses."
                  : "There are no rejected courses."}
              </p>
            </div>
          ) : (
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white shadow-sm hover:shadow-md border rounded-lg overflow-hidden transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between mb-2">
                      <Badge
                        variant="outline"
                        className="bg-purple-50 border-purple-200 text-purple-700"
                      >
                        Level {course.level}
                      </Badge>
                      <Badge className="bg-blue-100 border-blue-200 text-blue-700 uppercase">
                        {course.courseCode}
                      </Badge>
                    </div>

                    <div className="mt-4 mb-4">
                      <h3 className="font-semibold text-lg">
                        {course.courseName}
                      </h3>
                      <p className="mt-2 text-gray-700 text-sm line-clamp-3">
                        {course.description || "No description provided."}
                      </p>
                    </div>

                    <div className="flex items-center mt-4 text-gray-500 text-sm">
                      <span>
                        Created:{" "}
                        {new Date(course.createdAt || "").toLocaleDateString()}
                      </span>
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
                                course,
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
                                course,
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
                          onClick={() => handleDeleteAction(course)}
                        >
                          <Trash2 className="mr-2 w-4 h-4" />
                          Delete
                        </Button>
                      )}
                    </div>

                    {/* Review info */}
                    {activeTab !== ApprovalStatusEnum.PENDING &&
                      course.reviewedById && (
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
                            {/* <span> by {course.reviewedBy?.username || "Admin"}</span> */}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination controls */}
          {courses.length > 0 && (
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
      {selectedCourse && reviewAction && (
        <ReviewActionDialog
          isOpen={!!reviewAction}
          onClose={() => setReviewAction(null)}
          onConfirm={confirmReviewAction}
          action={reviewAction}
          contentType="Course"
        />
      )}

      {/* Delete confirmation dialog */}
      {selectedCourse && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          contentType="Course"
          itemName={`${selectedCourse.courseCode} - ${selectedCourse.courseName}`}
        />
      )}
    </div>
  );
};

export default CoursesReviewPage;
