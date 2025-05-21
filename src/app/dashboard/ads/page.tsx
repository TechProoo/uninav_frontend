"use client";

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/authContext";
import {
  Megaphone,
  Search,
  Filter,
  Info,
  Eye,
  MousePointer,
  Trash2,
  Plus,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Advert, AdvertTypeEnum } from "@/lib/types/response.type";
import { getMyAdverts, deleteAdvert, getAdvertById } from "@/api/advert.api";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const ManageAdsPage = () => {
  const router = useRouter();
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [selectedAdvert, setSelectedAdvert] = useState<Advert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [advertToDelete, setAdvertToDelete] = useState<string | null>(null);

  // Fetch adverts
  useEffect(() => {
    fetchAdverts();
  }, []);

  const fetchAdverts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getMyAdverts();

      if (response && response.status === "success") {
        setAdverts(response.data);
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

  // Get full advert details
  const loadAdvertDetails = async (advertId: string) => {
    try {
      const response = await getAdvertById(advertId);
      if (response && response.status === "success") {
        setSelectedAdvert(response.data);
      } else {
        setError("Failed to load advertisement details");
      }
    } catch (err) {
      console.error("Error loading advert details:", err);
      setError("An error occurred while loading advertisement details");
    }
  };

  const handleAdvertClick = (advert: Advert) => {
    loadAdvertDetails(advert.id);
  };

  const handleDeleteAdvert = async () => {
    if (!advertToDelete) return;

    try {
      setIsLoading(true);
      const response = await deleteAdvert(advertToDelete);

      if (response && response.status === "success") {
        // Remove from state
        setAdverts(adverts.filter((ad) => ad.id !== advertToDelete));
        if (selectedAdvert?.id === advertToDelete) {
          setSelectedAdvert(null);
        }
      } else {
        setError("Failed to delete advertisement");
      }
    } catch (err) {
      console.error("Error deleting advertisement:", err);
      setError("An error occurred while deleting the advertisement");
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setAdvertToDelete(null);
    }
  };

  const confirmDelete = (advertId: string) => {
    setAdvertToDelete(advertId);
    setIsDeleteDialogOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter adverts locally based on search query
    if (!searchQuery.trim()) {
      fetchAdverts();
      return;
    }

    const filtered = adverts.filter(
      (advert) =>
        advert.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (advert.description &&
          advert.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setAdverts(filtered);
  };

  const filterAdverts = () => {
    if (!filterType) {
      return adverts;
    }

    return adverts.filter((advert) => advert.type === filterType);
  };

  const displayedAdverts = filterAdverts();

  const goToMaterial = (materialId: string) => {
    if (materialId) {
      router.push(`/dashboard/materials?material=${materialId}`);
    }
  };

  return (
    <div className="mx-auto px-2 sm:px-4 container">
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-2 mb-3 sm:mb-6">
        <h1 className="section-heading">Manage Advertisements</h1>
        <Button
          onClick={() => router.push("/dashboard/materials")}
          className="px-3 sm:px-4 py-1.5 sm:py-2 w-full sm:w-auto h-8 sm:h-10 text-xs sm:text-sm"
        >
          <Plus className="mr-1 sm:mr-2 w-3 sm:w-4 h-3 sm:h-4" />
          Create New Ad
        </Button>
      </div>

      <div className="flex md:flex-row flex-col gap-2 sm:gap-3 mb-4 sm:mb-6">
        <form
          onSubmit={handleSearch}
          className="flex flex-grow w-full md:max-w-md"
        >
          <div className="relative w-full">
            <div className="left-0 absolute inset-y-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
              <Search className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-500" />
            </div>
            <input
              type="search"
              className="block px-2 sm:px-3 py-1.5 sm:py-2 pl-7 sm:pl-10 border border-gray-300 rounded-lg w-full text-xs sm:text-sm"
              placeholder="Search advertisements..."
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

        <div className="flex items-center gap-1 sm:gap-2">
          <Filter className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg w-full text-xs sm:text-sm"
          >
            <option value="">All Types</option>
            {Object.values(AdvertTypeEnum).map((type) => (
              <option key={type} value={type}>
                {type.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="gap-4 sm:gap-6 grid grid-cols-1 md:grid-cols-3">
        {/* Adverts List */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-md p-3 sm:p-4 rounded-lg">
            <h2 className="flex items-center mb-3 sm:mb-4 font-semibold text-base sm:text-lg md:text-xl">
              <Megaphone className="mr-1.5 sm:mr-2 w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
              Your Advertisements
            </h2>

            {isLoading ? (
              <div className="flex justify-center py-4 sm:py-8">
                <div className="text-xs sm:text-sm animate-pulse">
                  Loading advertisements...
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-3 sm:p-4 rounded text-red-600 text-xs sm:text-sm">
                {error}
              </div>
            ) : displayedAdverts.length === 0 ? (
              <div className="py-4 sm:py-8 text-center">
                <Megaphone className="mx-auto w-8 sm:w-12 h-8 sm:h-12 text-gray-400" />
                <h3 className="mt-2 font-medium text-gray-900 text-sm sm:text-base md:text-lg">
                  No advertisements yet
                </h3>
                <p className="mt-1 text-gray-500 text-xs sm:text-sm">
                  Create an advertisement to promote your materials.
                </p>
                <div className="mt-4 sm:mt-6">
                  <Button
                    onClick={() => router.push("/dashboard/materials")}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 h-7 sm:h-9 text-xs sm:text-sm"
                  >
                    <Plus className="mr-1 w-3 sm:w-4 h-3 sm:h-4" />
                    Create New Ad
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[600px] overflow-y-auto">
                {displayedAdverts.map((advert) => (
                  <div
                    key={advert.id}
                    className={`p-2 sm:p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedAdvert?.id === advert.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => handleAdvertClick(advert)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="mb-0.5 sm:mb-1 font-medium text-gray-900 text-xs sm:text-sm line-clamp-1">
                        {advert.label}
                      </h3>
                      <Badge
                        variant={
                          advert.type === "free" ? "default" : "destructive"
                        }
                        className="px-1 sm:px-1.5 h-4 sm:h-5 text-[10px] sm:text-xs"
                      >
                        {advert.type}
                      </Badge>
                    </div>
                    <p className="mb-1 sm:mb-2 text-[10px] text-gray-600 sm:text-xs line-clamp-2">
                      {advert.description || "No description provided"}
                    </p>
                    <div className="flex items-center text-[10px] text-gray-500 sm:text-xs">
                      <div className="flex items-center mr-2 sm:mr-3">
                        <Eye className="mr-0.5 sm:mr-1 w-2.5 sm:w-3 h-2.5 sm:h-3" />
                        {advert.views}
                      </div>
                      <div className="flex items-center">
                        <MousePointer className="mr-0.5 sm:mr-1 w-2.5 sm:w-3 h-2.5 sm:h-3" />
                        {advert.clicks}
                      </div>
                      <div className="ml-auto text-[10px] sm:text-xs">
                        {new Date(advert.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Advert Detail */}
        <div className="md:col-span-2">
          {selectedAdvert ? (
            <div className="bg-white shadow-md p-3 sm:p-6 rounded-lg">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <h2 className="font-semibold text-lg sm:text-xl md:text-2xl">
                  {selectedAdvert.label}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => confirmDelete(selectedAdvert.id)}
                    className="p-0 w-7 sm:w-8 h-7 sm:h-8"
                  >
                    <Trash2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  </Button>
                </div>
              </div>

              {/* Ad Status */}
              <div className="mb-3 sm:mb-4">
                <Badge
                  variant={
                    selectedAdvert.reviewStatus === "pending"
                      ? "outline"
                      : "default"
                  }
                  className="px-1.5 sm:px-2 h-5 sm:h-6 text-[10px] sm:text-xs"
                >
                  {selectedAdvert.reviewStatus}
                </Badge>
              </div>

              {/* Ad Image */}
              {selectedAdvert.imageUrl && (
                <div className="mb-4 sm:mb-6">
                  <div className="relative rounded-lg aspect-video overflow-hidden">
                    <img
                      src={selectedAdvert.imageUrl}
                      alt={selectedAdvert.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Ad Details */}
              <div className="mb-4 sm:mb-6">
                <h3 className="mb-1.5 sm:mb-2 font-medium text-base sm:text-lg">
                  Advertisement Details
                </h3>
                <div className="bg-gray-50 p-2.5 sm:p-4 rounded-lg">
                  <div className="gap-3 sm:gap-4 grid grid-cols-2">
                    <div>
                      <p className="text-[10px] text-gray-500 sm:text-xs">
                        Type
                      </p>
                      <p className="font-medium text-xs sm:text-sm">
                        {selectedAdvert.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 sm:text-xs">
                        Created At
                      </p>
                      <p className="font-medium text-xs sm:text-sm">
                        {new Date(selectedAdvert.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 sm:text-xs">
                        Views
                      </p>
                      <p className="font-medium text-xs sm:text-sm">
                        {selectedAdvert.views}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 sm:text-xs">
                        Clicks
                      </p>
                      <p className="font-medium text-xs sm:text-sm">
                        {selectedAdvert.clicks}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4 sm:mb-6">
                <h3 className="mb-1.5 sm:mb-2 font-medium text-base sm:text-lg">
                  Description
                </h3>
                <p className="text-gray-700 text-xs sm:text-sm">
                  {selectedAdvert.description || "No description provided."}
                </p>
              </div>

              {/* Associated Material */}
              {selectedAdvert.material && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="mb-1.5 sm:mb-2 font-medium text-base sm:text-lg">
                    Associated Material
                  </h3>
                  <div
                    className="hover:bg-gray-50 p-2.5 sm:p-4 border border-gray-200 rounded-lg cursor-pointer"
                    onClick={() =>
                      goToMaterial(selectedAdvert.material?.id || "")
                    }
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex justify-center items-center bg-blue-100 rounded w-8 sm:w-10 h-8 sm:h-10 text-blue-600">
                        <BookOpen className="w-4 sm:w-5 h-4 sm:h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-xs sm:text-sm">
                          {selectedAdvert.material.label}
                        </h4>
                        <p className="text-[10px] text-gray-500 sm:text-xs">
                          {selectedAdvert.material.type}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Data */}
              <div>
                <div className="flex items-center mb-1.5 sm:mb-2">
                  <h3 className="font-medium text-base sm:text-lg">
                    Performance
                  </h3>
                  <Info className="ml-1.5 sm:ml-2 w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-400" />
                </div>
                <div className="bg-gray-50 p-2.5 sm:p-4 rounded-lg">
                  <div className="text-center">
                    <p className="mb-0.5 sm:mb-1 text-[10px] text-gray-500 sm:text-xs">
                      Engagement Rate
                    </p>
                    <p className="font-bold text-base sm:text-xl">
                      {selectedAdvert.views > 0
                        ? `${(
                            (selectedAdvert.clicks / selectedAdvert.views) *
                            100
                          ).toFixed(1)}%`
                        : "0%"}
                    </p>
                    <p className="mt-0.5 sm:mt-1 text-[10px] text-gray-500 sm:text-xs">
                      Based on {selectedAdvert.views} views and{" "}
                      {selectedAdvert.clicks} clicks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center bg-white shadow-md p-4 sm:p-8 rounded-lg h-full">
              <div className="text-center">
                <Megaphone className="mx-auto mb-2 sm:mb-3 w-10 sm:w-16 h-10 sm:h-16 text-gray-300" />
                <h3 className="mb-1.5 sm:mb-2 font-medium text-gray-700 text-base sm:text-xl">
                  Select an advertisement
                </h3>
                <p className="max-w-md text-gray-500 text-xs sm:text-sm">
                  Click on an advertisement from the list to view details,
                  analytics, and manage your promotion.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Delete Advertisement
            </DialogTitle>
            <DialogDescription className="pt-2 text-xs sm:text-sm">
              Are you sure you want to delete this advertisement? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:flex-row flex-col gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading}
              className="order-2 sm:order-1 w-full sm:w-auto h-8 sm:h-10 text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAdvert}
              disabled={isLoading}
              className="order-1 sm:order-2 w-full sm:w-auto h-8 sm:h-10 text-xs sm:text-sm"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageAdsPage;
