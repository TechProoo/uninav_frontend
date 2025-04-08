"use client";

import React from "react";
import { useAuth } from "@/contexts/authContext";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto container">
      <h1 className="mb-6 font-bold text-3xl">Your Profile</h1>
      <div className="bg-white shadow-md p-8 rounded-lg">
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex justify-center items-center bg-blue-100 rounded-full w-20 h-20 font-medium text-blue-600 text-xl">
                {user.firstName?.charAt(0)}
                {user.lastName?.charAt(0)}
              </div>
              <div>
                <h2 className="font-semibold text-xl">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-500">@{user.username}</p>
              </div>
            </div>

            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mt-6">
              <div className="space-y-2">
                <p className="text-gray-500 text-sm">Email</p>
                <p>{user.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-500 text-sm">Department</p>
                <p>{user.department?.name || "Not specified"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-500 text-sm">Level</p>
                <p>{user.level}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-500 text-sm">Role</p>
                <p className="capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Loading profile information...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
