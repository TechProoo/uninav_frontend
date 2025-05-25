"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/api/user.api";
import { getMaterialsByCreator } from "@/api/material.api";
import { UserProfile, Material, Pagination } from "@/lib/types/response.type";
import Card from "@/components/ui/card/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MaterialGrid from "@/components/materials/MaterialGrid";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import {
  User,
  MapPin,
  Calendar,
  BookOpen,
  FileText,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface UserProfilePageProps {
  username: string;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ username }) => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<Omit<UserProfile, "email" | "auth"> | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        setError(null);
        const profile = await getUserProfile(username);
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile");
        toast.error("Failed to load user profile");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  // Fetch user materials
  useEffect(() => {
    const fetchMaterials = async () => {
      if (!userProfile) return;

      try {
        setIsLoadingMaterials(true);
        const response = await getMaterialsByCreator(userProfile.id, currentPage);
        
        if (response?.status === "success") {
          setMaterials(response.data.data);
          setTotalPages(response.data.pagination.totalPages);
          setHasMore(response.data.pagination.hasMore);
        }
      } catch (error) {
        console.error("Error fetching user materials:", error);
        toast.error("Failed to load user materials");
      } finally {
        setIsLoadingMaterials(false);
      }
    };

    fetchMaterials();
  }, [userProfile, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDepartmentClick = () => {
    if (userProfile?.department?.id) {
      router.push(`/course-map/department/${userProfile.department.id}`);
    }
  };

  const handleMaterialClick = (material: Material) => {
    router.push(`/material/${material.id}`);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 hover:bg-gray-100"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Profile Header */}
        <Card className="mb-8 p-6 sm:p-8 bg-white shadow-lg">
          {isLoadingProfile ? (
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-shrink-0">
                <SkeletonLoader shape="circle" width="120px" height="120px" />
              </div>
              <div className="flex-grow space-y-4">
                <SkeletonLoader width="200px" height="32px" />
                <SkeletonLoader width="150px" height="20px" />
                <SkeletonLoader width="180px" height="20px" />
                <SkeletonLoader width="160px" height="20px" />
                <div className="flex gap-2">
                  <SkeletonLoader width="80px" height="28px" />
                  <SkeletonLoader width="100px" height="28px" />
                </div>
              </div>
            </div>
          ) : userProfile ? (
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Profile Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 sm:w-30 sm:h-30 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                  {userProfile.firstName[0]}{userProfile.lastName[0]}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-grow">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {userProfile.firstName} {userProfile.lastName}
                </h1>
                
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">@{userProfile.username}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {userProfile.department && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span 
                        className="text-blue-600 hover:text-blue-800 cursor-pointer underline decoration-dotted underline-offset-2"
                        onClick={handleDepartmentClick}
                      >
                        {userProfile.department.name}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Level {userProfile.level}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      Joined {new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {userProfile.role}
                  </Badge>
                  
                </div>
              </div>
            </div>
          ) : null}
        </Card>

        {/* Materials Section */}
        <Card className="p-6 sm:p-8 bg-white shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Materials Contributed
            </h2>
            {!isLoadingMaterials && materials.length > 0 && (
              <span className="text-gray-500 text-sm">
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>

          {isLoadingMaterials ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="space-y-3">
                  <SkeletonLoader height="200px" />
                </div>
              ))}
            </div>
          ) : materials.length > 0 ? (
            <>
              <div className="mb-6">
                <MaterialGrid
                  materials={materials}
                  onMaterialClick={handleMaterialClick}
                  viewMode="grid"
                />
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, index) => {
                      const pageNumber = Math.max(1, currentPage - 2) + index;
                      if (pageNumber > totalPages) return null;
                      
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                          className={cn(
                            "w-8 h-8 p-0",
                            currentPage === pageNumber && "bg-blue-600 hover:bg-blue-700"
                          )}
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasMore}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No materials found
              </h3>
              <p className="text-gray-500">
                This user hasn't created any materials yet.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UserProfilePage; 