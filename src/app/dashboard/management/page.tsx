"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import {
  BookOpen,
  FileText,
  GraduationCap,
  Users,
  Megaphone,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  School,
} from "lucide-react";

// Define card data with icons and paths
const managementCards = [
  {
    title: "Materials Review",
    description: "Review and manage material submissions",
    icon: BookOpen,
    path: "/dashboard/management/materials",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Blogs Review",
    description: "Review and manage blog submissions",
    icon: FileText,
    path: "/dashboard/management/blogs",
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Courses Review",
    description: "Review and manage course submissions",
    icon: GraduationCap,
    path: "/dashboard/management/courses",
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Course Management",
    description: "Create and link courses to departments",
    icon: School,
    path: "/dashboard/management/course-management",
    color: "bg-teal-50 text-teal-600",
  },
  {
    title: "DLC Review",
    description: "Review Department Level Courses",
    icon: Award,
    path: "/dashboard/management/dlc",
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Moderator Applications",
    description: "Review moderator applications",
    icon: Users,
    path: "/dashboard/management/moderators",
    color: "bg-indigo-50 text-indigo-600",
    adminOnly: true,
  },
  {
    title: "Adverts Review",
    description: "Review and manage advertisement submissions",
    icon: Megaphone,
    path: "/dashboard/management/adverts",
    color: "bg-rose-50 text-rose-600",
  },
];

// Status indicators with color coding
const statusIndicators = [
  {
    name: "Pending",
    description: "Items awaiting review",
    icon: AlertTriangle,
    color: "bg-amber-50 text-amber-600 border-amber-200",
  },
  {
    name: "Approved",
    description: "Items that have been approved",
    icon: CheckCircle,
    color: "bg-green-50 text-green-600 border-green-200",
  },
  {
    name: "Rejected",
    description: "Items that have been rejected",
    icon: XCircle,
    color: "bg-red-50 text-red-600 border-red-200",
  },
];

const ManagementPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  // Redirect if not admin or moderator
  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "moderator") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // If user not loaded yet or not admin/moderator, show loading or nothing
  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return null;
  }

  return (
    <div className="mx-auto px-4 container">
      <h1 className="mb-2 font-bold text-3xl">Site Management</h1>
      <p className="mb-8 text-gray-600">
        Manage and review content submissions across the platform.
      </p>

      {/* Status indicators */}
      <div className="mb-8">
        <h2 className="mb-4 font-semibold text-xl">Status Guide</h2>
        <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
          {statusIndicators.map((status) => (
            <div
              key={status.name}
              className={`${status.color} p-4 rounded-lg border flex items-center gap-3`}
            >
              <status.icon className="w-8 h-8" />
              <div>
                <h3 className="font-medium">{status.name}</h3>
                <p className="opacity-80 text-sm">{status.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Management cards grid */}
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {managementCards
          .filter((card) => !card.adminOnly || user.role === "admin")
          .map((card) => (
            <div
              key={card.title}
              className="bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-shadow cursor-pointer"
              onClick={() => router.push(card.path)}
            >
              <div className="p-6">
                <div
                  className={`${card.color} w-12 h-12 rounded-lg mb-4 flex items-center justify-center`}
                >
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="mb-2 font-semibold text-xl">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
              </div>
            </div>
          ))}
      </div>

      {/* Admin note */}
      {user.role === "admin" && (
        <div className="bg-blue-50 mt-8 p-4 border border-blue-200 rounded-lg">
          <h4 className="mb-1 font-medium text-blue-700">Admin Access</h4>
          <p className="text-blue-600 text-sm">
            As an administrator, you have full access to all management features
            including delete permissions and moderator application reviews.
          </p>
        </div>
      )}

      {/* Moderator note */}
      {user.role === "moderator" && (
        <div className="bg-green-50 mt-8 p-4 border border-green-200 rounded-lg">
          <h4 className="mb-1 font-medium text-green-700">Moderator Access</h4>
          <p className="text-green-600 text-sm">
            As a moderator, you can approve or reject content submissions. Note
            that only administrators can delete content and review moderator
            applications.
          </p>
        </div>
      )}
    </div>
  );
};

export default ManagementPage;
