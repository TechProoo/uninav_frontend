"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  CheckCircle,
  XCircle,
  Shield,
  User,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ApprovalStatusEnum } from "@/lib/types/response.type";
import {
  listModeratorApplications,
  reviewModeratorApplication,
  ReviewActionDTO,
} from "@/api/review.api";
import ReviewTabs from "@/components/management/ReviewTabs";
import ReviewActionDialog from "@/components/management/ReviewActionDialog";
import toast from "react-hot-toast";
import Link from "next/link";

// Define the moderator application interface based on the docs
interface ModeratorApplication {
  id: string;
  userId: string;
  reason: string;
  reviewStatus: ApprovalStatusEnum;
  reviewedById: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    departmentId: string;
    level: number;
    department?: {
      name: string;
    };
  };
}

const ModeratorReviewPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(
    ApprovalStatusEnum.PENDING
  );
  const [applications, setApplications] = useState<ModeratorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApplication, setSelectedApplication] =
    useState<ModeratorApplication | null>(null);

  // Dialog states
  const [reviewAction, setReviewAction] = useState<ApprovalStatusEnum | null>(
    null
  );

  // Counters for tabs
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Fetch applications when tab changes or pagination changes
  useEffect(() => {
    fetchApplications();
  }, [activeTab, currentPage]);

  // Fetch counts for each status
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
          listModeratorApplications({
            status: ApprovalStatusEnum.PENDING,
            page: 1,
            limit: 1,
          }),
          listModeratorApplications({
            status: ApprovalStatusEnum.APPROVED,
            page: 1,
            limit: 1,
          }),
          listModeratorApplications({
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

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await listModeratorApplications({
        status: activeTab as ApprovalStatusEnum,
        page: currentPage,
        limit: 10,
      });

      if (response?.status === "success") {
        setApplications(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError("Failed to load moderator applications");
      }
    } catch (err) {
      console.error("Error fetching moderator applications:", err);
      setError("An error occurred while loading moderator applications");
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
    fetchApplications();
  };

  const handleReviewAction = (
    application: ModeratorApplication,
    action: ApprovalStatusEnum
  ) => {
    setSelectedApplication(application);
    setReviewAction(action);
  };

  const confirmReviewAction = async (
    action: ApprovalStatusEnum,
    comment: string
  ) => {
    if (!selectedApplication) return;

    try {
      const reviewData: ReviewActionDTO = {
        action,
        comment: comment.trim() || undefined,
      };

      const response = await reviewModeratorApplication(
        selectedApplication.userId,
        reviewData
      );

      if (response?.status === "success") {
        toast.success(
          `Moderator application has been ${
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

        fetchApplications();
      } else {
        toast.error("Action failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during review action:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // If user not loaded yet or not admin, show nothing
  if (!user || user.role !== "admin") {
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
        <h1 className="font-bold text-3xl">Moderator Applications</h1>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="search"
            placeholder="Search by name or email..."
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

      <div className="bg-blue-50 mb-8 p-4 border border-blue-200 rounded-lg">
        <h3 className="flex items-center mb-2 font-medium text-blue-800">
          <Shield className="mr-2 w-5 h-5" />
          Admin Only Section
        </h3>
        <p className="text-blue-600 text-sm">
          This section allows you to review and manage moderator applications.
          Approved users will gain moderator privileges and access to content
          review features.
        </p>
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
          ) : applications.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-md text-center">
              <Users className="mx-auto mb-4 w-12 h-12 text-gray-400" />
              <h3 className="mb-2 font-medium text-xl">
                No moderator applications found
              </h3>
              <p className="text-gray-500">
                {activeTab === ApprovalStatusEnum.PENDING
                  ? "There are no moderator applications waiting for review."
                  : activeTab === ApprovalStatusEnum.APPROVED
                  ? "There are no approved moderator applications."
                  : "There are no rejected moderator applications."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="bg-white shadow-sm hover:shadow-md border rounded-lg overflow-hidden transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex md:flex-row flex-col md:justify-between md:items-start gap-4">
                      <div className="flex-1">
                        {/* User Info */}
                        <div className="flex items-center mb-4">
                          <div className="flex justify-center items-center bg-indigo-100 mr-4 rounded-full w-12 h-12">
                            <User className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">
                              {application.user.firstName}{" "}
                              {application.user.lastName}
                            </h3>
                            <p className="text-gray-500">
                              {application.user.username}
                            </p>
                          </div>
                        </div>

                        {/* Contact & Additional Info */}
                        <div className="gap-2 grid grid-cols-1 md:grid-cols-2 mb-4">
                          <div className="flex items-center text-gray-600">
                            <Mail className="mr-2 w-4 h-4" />
                            <span>{application.user.email}</span>
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">Level:</span>{" "}
                            {application.user.level}
                          </div>
                          {application.user.department && (
                            <div className="md:col-span-2 text-gray-600">
                              <span className="font-medium">Department:</span>{" "}
                              {application.user.department.name}
                            </div>
                          )}
                        </div>

                        {/* Application Reason */}
                        <div className="mb-4">
                          <h4 className="mb-2 font-medium text-gray-700 text-sm">
                            Reason for application:
                          </h4>
                          <div className="bg-gray-50 p-3 rounded-md text-gray-700 text-sm">
                            {application.reason || "No reason provided."}
                          </div>
                        </div>

                        <p className="text-gray-500 text-sm">
                          Applied on:{" "}
                          {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Action buttons for pending applications */}
                      <div className="flex md:flex-col gap-2">
                        {activeTab === ApprovalStatusEnum.PENDING && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 w-full"
                              onClick={() =>
                                handleReviewAction(
                                  application,
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
                              className="w-full"
                              onClick={() =>
                                handleReviewAction(
                                  application,
                                  ApprovalStatusEnum.REJECTED
                                )
                              }
                            >
                              <XCircle className="mr-2 w-4 h-4" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Review info for approved/rejected applications */}
                    {activeTab !== ApprovalStatusEnum.PENDING && (
                      <div className="mt-4 pt-4 border-gray-200 border-t">
                        <Badge
                          className={
                            activeTab === ApprovalStatusEnum.APPROVED
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }
                        >
                          {activeTab === ApprovalStatusEnum.APPROVED
                            ? "Approved"
                            : "Rejected"}
                        </Badge>

                        {/* Show any review comments if available */}
                        {/* This part would need actual data from the API */}
                        {/* {application.reviewComment && (
                          <p className="mt-2 text-gray-600 text-sm">
                            <span className="font-medium">Comment:</span> {application.reviewComment}
                          </p>
                        )} */}
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

      {/* Review action dialog */}
      {selectedApplication && reviewAction && (
        <ReviewActionDialog
          isOpen={!!reviewAction}
          onClose={() => setReviewAction(null)}
          onConfirm={confirmReviewAction}
          action={reviewAction}
          contentType="Moderator Application"
        />
      )}
    </div>
  );
};

export default ModeratorReviewPage;
