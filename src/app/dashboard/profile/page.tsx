"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { updateUserProfile } from "@/api/user.api";
import { Check, Edit2, Loader2, User, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DepartmentByFacultySelect from "@/components/ui/DepartmentByFacultySelect";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, refreshUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLevelWarning, setShowLevelWarning] = useState(false);
  const [showDepartmentWarning, setShowDepartmentWarning] = useState(false);
  const [tempLevel, setTempLevel] = useState<number | null>(null);
  const [tempDepartmentId, setTempDepartmentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    level: user?.level || 100,
    departmentId: user?.departmentId || "",
  });

  const toggleEdit = () => {
    if (isEditing) {
      // Reset form data if canceling edit
      setFormData({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        username: user?.username || "",
        level: user?.level || 100,
        departmentId: user?.departmentId || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "level" && parseInt(value) !== user?.level) {
      setTempLevel(parseInt(value));
      setShowLevelWarning(true);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "level" ? parseInt(value) : value,
    }));
  };

  const handleDepartmentSelect = (departmentId: string) => {
    if (departmentId !== user?.departmentId) {
      setTempDepartmentId(departmentId);
      setShowDepartmentWarning(true);
      return;
    }
    setFormData((prev) => ({ ...prev, departmentId }));
  };

  const handleLevelChangeConfirm = () => {
    if (tempLevel !== null) {
      setFormData((prev) => ({
        ...prev,
        level: tempLevel,
      }));
    }
    setShowLevelWarning(false);
    setTempLevel(null);
  };

  const handleDepartmentChangeConfirm = () => {
    if (tempDepartmentId !== null) {
      setFormData((prev) => ({
        ...prev,
        departmentId: tempDepartmentId,
      }));
    }
    setShowDepartmentWarning(false);
    setTempDepartmentId(null);
  };

  const handleLevelChangeCancel = () => {
    setShowLevelWarning(false);
    setTempLevel(null);
    setFormData((prev) => ({
      ...prev,
      level: user?.level || 100,
    }));
  };

  const handleDepartmentChangeCancel = () => {
    setShowDepartmentWarning(false);
    setTempDepartmentId(null);
    setFormData((prev) => ({
      ...prev,
      departmentId: user?.departmentId || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updated = await updateUserProfile(formData);
      if (updated) {
        await refreshUserProfile();
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto px-2 sm:px-4 max-w-4xl container">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="section-heading">Your Profile</h1>
        <button
          onClick={toggleEdit}
          disabled={isSubmitting}
          className={`flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 rounded-md transition-colors text-xs sm:text-sm ${
            isEditing
              ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
              : "bg-[#003666] hover:bg-[#002a52] text-white"
          }`}
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Edit2 size={14} className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              <span>Edit Profile</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#003666] to-[#75bfff] px-4 sm:px-6 py-6 sm:py-8 text-white">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex justify-center items-center bg-white/20 backdrop-blur-sm border-2 border-white/50 rounded-full w-16 sm:w-24 h-16 sm:h-24 font-medium text-white text-xl sm:text-3xl">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div>
              <h2 className="font-semibold text-xl sm:text-2xl">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-blue-100 text-sm sm:text-base">
                @{user?.username}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="gap-4 sm:gap-6 grid grid-cols-1 md:grid-cols-2">
            {/* First Name */}
            <div className="space-y-1 sm:space-y-2">
              <label
                htmlFor="firstName"
                className="font-medium text-gray-700 text-xs sm:text-sm"
              >
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="p-1.5 sm:p-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full text-xs sm:text-sm"
                />
              ) : (
                <p className="bg-gray-50 p-1.5 sm:p-2 rounded-md text-xs sm:text-sm">
                  {user?.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-1 sm:space-y-2">
              <label
                htmlFor="lastName"
                className="font-medium text-gray-700 text-xs sm:text-sm"
              >
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="p-1.5 sm:p-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full text-xs sm:text-sm"
                />
              ) : (
                <p className="bg-gray-50 p-1.5 sm:p-2 rounded-md text-xs sm:text-sm">
                  {user?.lastName}
                </p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-1 sm:space-y-2">
              <label
                htmlFor="username"
                className="font-medium text-gray-700 text-xs sm:text-sm"
              >
                Username
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="p-1.5 sm:p-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full text-xs sm:text-sm"
                />
              ) : (
                <p className="bg-gray-50 p-1.5 sm:p-2 rounded-md text-xs sm:text-sm">
                  @{user?.username}
                </p>
              )}
            </div>

            {/* Level */}
            <div className="space-y-1 sm:space-y-2">
              <label
                htmlFor="level"
                className="font-medium text-gray-700 text-xs sm:text-sm"
              >
                Level
              </label>
              {isEditing ? (
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="p-1.5 sm:p-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full text-xs sm:text-sm"
                >
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                  <option value={300}>300</option>
                  <option value={400}>400</option>
                  <option value={500}>500</option>
                  <option value={600}>600</option>
                </select>
              ) : (
                <p className="bg-gray-50 p-1.5 sm:p-2 rounded-md text-xs sm:text-sm">
                  {user?.level}
                </p>
              )}
            </div>

            {/* Department Selection */}
            <div className="space-y-1 sm:space-y-2">
              <label className="font-medium text-gray-700 text-xs sm:text-sm">
                Department
              </label>
              {isEditing ? (
                <DepartmentByFacultySelect
                  onDepartmentSelect={handleDepartmentSelect}
                  defaultDepartmentId={formData.departmentId}
                />
              ) : (
                <p className="bg-gray-50 p-1.5 sm:p-2 rounded-md text-xs sm:text-sm">
                  {user?.department?.name || "Not specified"}
                </p>
              )}
            </div>
          </div>

          {/* Non-editable information */}
          <div className="gap-4 sm:gap-6 grid grid-cols-1 md:grid-cols-2 mt-4 sm:mt-6">
            <div className="space-y-1 sm:space-y-2">
              <label className="font-medium text-gray-700 text-xs sm:text-sm">
                Email
              </label>
              <p className="bg-gray-50 p-1.5 sm:p-2 rounded-md text-xs sm:text-sm">
                {user?.email}
              </p>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label className="font-medium text-gray-700 text-xs sm:text-sm">
                Role
              </label>
              <p className="bg-gray-50 p-1.5 sm:p-2 rounded-md text-xs sm:text-sm capitalize">
                {user?.role}
              </p>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <label className="font-medium text-gray-700 text-xs sm:text-sm">
                Account Created
              </label>
              <p className="bg-gray-50 p-1.5 sm:p-2 rounded-md text-xs sm:text-sm">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
          </div>

          {/* Level Change Warning Dialog */}
          <Dialog open={showLevelWarning} onOpenChange={setShowLevelWarning}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-amber-600 text-sm sm:text-base">
                  <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                  Change Level Warning
                </DialogTitle>
                <DialogDescription className="pt-3 sm:pt-4 text-xs sm:text-sm">
                  All your courses will be reset to courses for level{" "}
                  {tempLevel} in the department of {user?.department?.name}. Are
                  you sure you want to continue?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start space-x-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleLevelChangeConfirm}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 h-8 sm:h-9 text-xs sm:text-sm"
                >
                  Yes, Change Level
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLevelChangeCancel}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 h-8 sm:h-9 text-xs sm:text-sm"
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Department Change Warning Dialog */}
          <Dialog
            open={showDepartmentWarning}
            onOpenChange={setShowDepartmentWarning}
          >
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-amber-600 text-sm sm:text-base">
                  <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                  Change Department Warning
                </DialogTitle>
                <DialogDescription className="pt-3 sm:pt-4 text-xs sm:text-sm">
                  Changing your department will reset your courses and materials
                  recommendations. Are you sure you want to continue?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start space-x-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDepartmentChangeConfirm}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 h-8 sm:h-9 text-xs sm:text-sm"
                >
                  Yes, Change Department
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDepartmentChangeCancel}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 h-8 sm:h-9 text-xs sm:text-sm"
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {isEditing && (
            <div className="flex justify-end mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 px-3 sm:px-4 py-1 sm:py-2 rounded-md h-8 sm:h-10 text-white text-xs sm:text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-1 w-3 sm:w-4 h-3 sm:h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="mr-1 w-3 sm:w-4 h-3 sm:h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
