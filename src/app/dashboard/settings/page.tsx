"use client";

import React from "react";

const SettingsPage = () => {
  return (
    <div className="mx-auto container">
      <h1 className="mb-6 font-bold text-3xl">Settings</h1>
      <div className="bg-white shadow-md p-8 rounded-lg">
        <div className="space-y-8">
          <div>
            <h2 className="mb-4 font-semibold text-xl">Account Settings</h2>
            <p className="mb-4 text-gray-600">
              Manage your account settings and preferences.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-xl">
              Notification Preferences
            </h2>
            <p className="mb-4 text-gray-600">
              Configure how and when you receive notifications.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-xl">Privacy Settings</h2>
            <p className="mb-4 text-gray-600">
              Control your privacy settings and data visibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
