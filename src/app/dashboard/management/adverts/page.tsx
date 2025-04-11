"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import {
  Megaphone,
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
import { Input } from "@/components/ui/input";
import { ApprovalStatusEnum } from "@/lib/types/response.type";
import {
  ReviewActionDTO,
  getAdvertReviewCounts,
  listAdvertReviews,
  reviewAdvert,
  deleteAdvertAsAdmin,
  ReviewCounts,
} from "@/api/review.api";
import ReviewTabs from "@/components/management/ReviewTabs";
import ReviewActionDialog from "@/components/management/ReviewActionDialog";
import DeleteConfirmationDialog from "@/components/management/DeleteConfirmationDialog";
import AdvertDetail from "@/components/materials/AdvertDetail";
import toast from "react-hot-toast";
import { Advert } from "@/lib/types/response.type";
import Link from "next/link";

const AdvertsReviewPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(
    ApprovalStatusEnum.PENDING
  );
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAdvert, setSelectedAdvert] = useState<Advert | null>(null);
  const [viewingAdvert, setViewingAdvert] = useState<Advert | null>(null);

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

  // Fetch adverts when tab changes or pagination changes
  useEffect(() => {
    fetchAdverts();
  }, [activeTab, currentPage]);

  // Fetch counts using API endpoint
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await getAdvertReviewCounts();
        if (response?.status === "success") {
          setCounts(response.data);
        }
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };

    fetchCounts();
  }, []); // Only fetch once on mount

  const fetchAdverts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await listAdvertReviews({
        status: activeTab as ApprovalStatusEnum,
        page: currentPage,
        limit: 10,
        query: searchQuery || undefined,
      });

      if (response?.status === "success") {
        setAdverts(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError("Failed to load advertisements");
      }
    } catch (err) {
      console.error("Error fetching advertisements:", err);
      setError("An error occurred while loading advertisements");
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
    fetchAdverts();
  };

  const handleReviewAction = (advert: Advert, action: ApprovalStatusEnum) => {
    setSelectedAdvert(advert);
    setReviewAction(action);
  };

  const handleDeleteAction = (advert: Advert) => {
    setSelectedAdvert(advert);
    setIsDeleteDialogOpen(true);
  };

  const handleAdvertClick = (advert: Advert) => {
    setViewingAdvert(advert);
  };

  const confirmReviewAction = async (
    action: ApprovalStatusEnum,
    comment: string
  ) => {
    if (!selectedAdvert) return;

    try {
      const reviewData: ReviewActionDTO = {
        action,
        comment: comment.trim() || undefined,
      };

      const response = await reviewAdvert(selectedAdvert.id, reviewData);

      if (response?.status === "success") {
        toast.success(
          `Advert has been ${
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

        fetchAdverts();
      } else {
        toast.error("Action failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during review action:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const confirmDelete = async () => {
    if (!selectedAdvert || user?.role !== "admin") return;

    try {
      const response = await deleteAdvertAsAdmin(selectedAdvert.id);

      if (response?.status === "success") {
        toast.success("Advertisement has been deleted");

        // Update counts based on current tab
        setCounts((prev) => ({
          ...prev,
          [activeTab.toLowerCase()]: Math.max(
            0,
            prev[activeTab.toLowerCase() as keyof ReviewCounts] - 1
          ),
        }));

        fetchAdverts();
      } else {
        toast.error("Failed to delete advertisement");
      }
    } catch (error) {
      console.error("Error deleting advertisement:", error);
      toast.error("An error occurred while deleting advertisement");
    }
  };

  const formatAdvertType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  const getAdvertTypeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "free":
        return "bg-green-100 text-green-700";
      case "pro":
        return "bg-blue-100 text-blue-700";
      case "boost":
        return "bg-purple-100 text-purple-700";
      case "targeted":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
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
        <h1 className="font-bold text-3xl">Advertisements Review</h1>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="search"
            placeholder="Search advertisements..."
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
          ) : adverts.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-md text-center">
              <Megaphone className="mx-auto mb-4 w-12 h-12 text-gray-400" />
              <h3 className="mb-2 font-medium text-xl">
                No advertisements found
              </h3>
              <p className="text-gray-500">
                {activeTab === ApprovalStatusEnum.PENDING
                  ? "There are no advertisements waiting for review."
                  : activeTab === ApprovalStatusEnum.APPROVED
                  ? "There are no approved advertisements."
                  : "There are no rejected advertisements."}
              </p>
            </div>
          ) : (
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {adverts.map((advert) => (
                <div
                  key={advert.id}
                  className="bg-white shadow-sm hover:shadow-md border rounded-lg overflow-hidden transition-shadow"
                >
                  <div className="relative bg-gray-100 aspect-video">
                    {advert.imageUrl ? (
                      <img
                        src={advert.imageUrl}
                        alt={advert.label}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/Image/blank-book-cover-white-vector-illustration.png";
                        }}
                      />
                    ) : (
                      <div className="flex justify-center items-center h-full">
                        <Megaphone className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="top-2 right-2 absolute">
                      <div
                        className={`px-2 py-1 rounded-md text-xs font-medium ${getAdvertTypeClass(
                          advert.type
                        )}`}
                      >
                        {formatAdvertType(advert.type)}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-1">
                          {advert.label}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-2">
                          {advert.description || "No description provided."}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAdvertClick(advert)}
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
                                advert,
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
                                advert,
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
                          onClick={() => handleDeleteAction(advert)}
                        >
                          <Trash2 className="mr-2 w-4 h-4" />
                          Delete
                        </Button>
                      )}
                    </div>

                    {/* Review info for non-pending items */}
                    {activeTab !== ApprovalStatusEnum.PENDING &&
                      advert.reviewedBy && (
                        <div className="mt-4 pt-4 border-gray-100 border-t">
                          <p className="text-sm">
                            {activeTab === ApprovalStatusEnum.APPROVED ? (
                              <span className="text-green-600">
                                Approved by:{" "}
                              </span>
                            ) : (
                              <span className="text-red-600">
                                Rejected by:{" "}
                              </span>
                            )}
                            {advert.reviewedBy.username}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination controls */}
          {adverts.length > 0 && totalPages > 1 && (
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

      {/* Advertisement preview modal */}
      {viewingAdvert && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 p-4">
          <div className="bg-white shadow-xl rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <AdvertDetail
              advertId={viewingAdvert.id}
              initialAdvert={viewingAdvert}
              onClose={() => setViewingAdvert(null)}
            />
          </div>
        </div>
      )}

      {/* Review action dialog */}
      {selectedAdvert && reviewAction && (
        <ReviewActionDialog
          isOpen={!!reviewAction}
          onClose={() => setReviewAction(null)}
          onConfirm={confirmReviewAction}
          action={reviewAction}
          contentType="Advertisement"
        />
      )}

      {/* Delete confirmation dialog */}
      {selectedAdvert && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          contentType="Advertisement"
          itemName={selectedAdvert.label}
        />
      )}
    </div>
  );
};

export default AdvertsReviewPage;
