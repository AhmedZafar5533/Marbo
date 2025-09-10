import React, { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Camera,
  Calendar,
  Mail,
  User,
  Lock,
  Check,
  X,
  Key,
} from "lucide-react";
import { useAuthStore } from "../../Store/authStore";

const ProfilePage = () => {
  const [userData, setUser] = useState({
    username: "johndoe",
    email: "john.doe@example.com",
    createdAt: "March 15, 2023",
    profilePic: "/api/placeholder/150/150",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { user, uploadProfilePic } = useAuthStore();
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // For password fields and validation
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");

  // States to toggle visibility for each password field
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Regex: Minimum 8 characters, at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsEditing(true);
    }
  };

  useEffect(() => {
    if (user) {
      const date = user.createdAt.split("T")[0];
      setUser({ ...user, createdAt: date });
    }
  }, [user]);

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    try {
      const base64Image = await toBase64(selectedFile);
      await uploadProfilePic(base64Image);

      setUser({ ...user, profilePic: previewUrl });
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const togglePasswordFields = () => {
    setShowPasswordFields((prev) => !prev);
    setPasswordError("");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "new") {
      if (!passwordRegex.test(value)) {
        setPasswordError(
          "Password must be at least 8 characters, and include a letter and a number."
        );
      } else if (passwords.confirm && value !== passwords.confirm) {
        setPasswordError("New password and confirmation do not match.");
      } else {
        setPasswordError("");
      }
    }

    if (field === "confirm") {
      if (value !== passwords.new) {
        setPasswordError("New password and confirmation do not match.");
      } else {
        setPasswordError("");
      }
    }
  };

  const handlePasswordSubmit = () => {
    if (!passwordRegex.test(passwords.new)) {
      setPasswordError(
        "Password must be at least 8 characters, and include a letter and a number."
      );
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    // Implement actual password update logic here.
    alert("Password changed successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
    setShowPasswordFields(false);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 min-h-screen py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">
            Your Profile
          </h1>
          <p className="text-indigo-600">
            Manage your account information and security settings
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-100">
          <div className="flex flex-col lg:flex-row">
            {/* Left Column - Profile Photo */}
            <div className="lg:w-1/3 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 p-8 lg:p-12 flex flex-col items-center justify-center text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <pattern
                      id="grid"
                      width="8"
                      height="8"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 8 0 L 0 0 0 8"
                        fill="none"
                        stroke="white"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="relative group">
                  <div className="h-48 w-48 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-8 ring-indigo-300 ring-opacity-50 transform transition-all duration-300 hover:scale-105">
                    <img
                      src={
                        userData.profilePic?.url ||
                        "https://www.gravatar.com/avatar/?d=mp&s=400"
                      }
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <label
                    htmlFor="profile-upload"
                    className="absolute bottom-3 right-3 bg-white hover:bg-gray-100 text-indigo-600 p-3 rounded-full cursor-pointer shadow-lg transition-all transform hover:scale-110"
                  >
                    <Camera className="w-6 h-6" />
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {isEditing && (
                  <div className="mt-8 flex space-x-4">
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors shadow-md flex items-center"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 bg-indigo-800 text-white font-medium rounded-lg hover:bg-indigo-900 transition-colors shadow-md flex items-center"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}

                <div className="mt-8 text-center">
                  <h2 className="text-4xl font-bold text-white mb-2">
                    {userData.username}
                  </h2>
                  <div className="flex items-center justify-center text-indigo-200 mt-4 text-lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>Member since: {userData.createdAt}</span>
                  </div>
                </div>

                <div className="mt-10 w-full">
                  <div className="bg-indigo-700 bg-opacity-50 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="font-semibold text-lg mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      Account Status
                    </h3>
                    <div className="flex items-center mt-2">
                      <div className="h-3 w-3 bg-green-400 rounded-full mr-2"></div>
                      <span>Active</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-indigo-500 border-opacity-50">
                      <p className="text-sm text-indigo-200">
                        Last login: Today at 9:45 AM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Profile Information */}
            <div className="lg:w-2/3 p-8 lg:p-12">
              <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <User className="w-6 h-6 mr-3 text-indigo-600" />
                Profile Information
              </h1>

              <div className="space-y-6">
                <div className="bg-indigo-50 rounded-xl p-6 transition-all duration-300 hover:shadow-md">
                  <label className="block text-sm font-medium text-indigo-800 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-indigo-500" />
                    </div>
                    <input
                      type="text"
                      value={userData.username}
                      readOnly
                      className="w-full pl-12 px-4 py-4 border border-indigo-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    />
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-xl p-6 transition-all duration-300 hover:shadow-md">
                  <label className="block text-sm font-medium text-indigo-800 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-indigo-500" />
                    </div>
                    <input
                      type="email"
                      value={userData.email}
                      readOnly
                      className="w-full pl-12 px-4 py-4 border border-indigo-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    />
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-xl p-6 transition-all duration-300 hover:shadow-md">
                  <label className="block text-sm font-medium text-indigo-800 mb-2">
                    Account Created
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="w-5 h-5 text-indigo-500" />
                    </div>
                    <input
                      type="text"
                      value={userData.createdAt}
                      readOnly
                      className="w-full pl-12 px-4 py-4 border border-indigo-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    />
                  </div>
                </div>

                {/* Security Section */}
                <div className="mt-10 pt-6 border-t border-indigo-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <Lock className="w-6 h-6 mr-3 text-indigo-600" />
                    Security Settings
                  </h2>

                  {/* Change Password Button */}
                  {!showPasswordFields && (
                    <div className="pt-4">
                      <button
                        onClick={togglePasswordFields}
                        className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg flex items-center justify-center w-full sm:w-auto transform hover:translate-y-px"
                      >
                        <Key className="w-5 h-5 mr-2" />
                        Change Password
                      </button>
                    </div>
                  )}

                  {/* Password Change Section */}
                  <div
                    className={`mt-8 transition-all duration-500 ease-in-out overflow-hidden ${
                      showPasswordFields
                        ? "max-h-[650px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="bg-indigo-50 rounded-2xl p-8 shadow-inner">
                      <h3 className="text-xl font-bold text-indigo-800 mb-6 flex items-center">
                        <Lock className="w-5 h-5 mr-2 text-indigo-600" />
                        Update Your Password
                      </h3>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-indigo-800 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Key className="w-5 h-5 text-indigo-500" />
                            </div>
                            <input
                              type={showCurrent ? "text" : "password"}
                              value={passwords.current}
                              onChange={(e) =>
                                handlePasswordChange("current", e.target.value)
                              }
                              className="w-full pl-12 pr-12 py-4 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                              placeholder="Enter your current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrent((prev) => !prev)}
                              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-indigo-700"
                            >
                              {showCurrent ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-indigo-800 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Lock className="w-5 h-5 text-indigo-500" />
                            </div>
                            <input
                              type={showNew ? "text" : "password"}
                              value={passwords.new}
                              onChange={(e) =>
                                handlePasswordChange("new", e.target.value)
                              }
                              className="w-full pl-12 pr-12 py-4 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                              placeholder="Enter your new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNew((prev) => !prev)}
                              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-indigo-700"
                            >
                              {showNew ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          {passwordError && (
                            <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                              {passwordError}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-indigo-800 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Check className="w-5 h-5 text-indigo-500" />
                            </div>
                            <input
                              type={showConfirm ? "text" : "password"}
                              value={passwords.confirm}
                              onChange={(e) =>
                                handlePasswordChange("confirm", e.target.value)
                              }
                              className="w-full pl-12 pr-12 py-4 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                              placeholder="Confirm your new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirm((prev) => !prev)}
                              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-indigo-700"
                            >
                              {showConfirm ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          {passwords.confirm &&
                            passwords.new !== passwords.confirm && (
                              <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                                Passwords do not match.
                              </p>
                            )}
                        </div>

                        <div className="pt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                          <button
                            onClick={handlePasswordSubmit}
                            className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg flex items-center justify-center"
                          >
                            <Check className="w-5 h-5 mr-2" />
                            Update Password
                          </button>
                          <button
                            onClick={togglePasswordFields}
                            className="px-6 py-4 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors shadow-md flex items-center justify-center"
                          >
                            <X className="w-5 h-5 mr-2" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Security Features
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                                        <div className="flex items-center mb-3">
                                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                                </svg>
                                            </div>
                                            <h3 className="font-semibold text-blue-800">Two-Factor Authentication</h3>
                                        </div>
                                        <p className="text-blue-800 text-sm mb-3">Add an extra layer of security to your account</p>
                                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                                            Enable 2FA
                                        </button>
                                    </div>

                                    <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 shadow-sm">
                                        <div className="flex items-center mb-3">
                                            <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                                </svg>
                                            </div>
                                            <h3 className="font-semibold text-purple-800">Login Activity</h3>
                                        </div>
                                        <p className="text-purple-800 text-sm mb-3">Review your recent sign-in activity</p>
                                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                                            View Activity
                                        </button>
                                    </div>
                                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-12 text-center text-indigo-600 text-sm">
          <p>
            Need help? Contact{" "}
            <a href="#" className="underline hover:text-indigo-800">
              Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
