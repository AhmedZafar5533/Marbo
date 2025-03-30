import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../Store/authStore';

const ProfilePage = () => {
    const [userData, setUser] = useState({
        username: 'johndoe',
        email: 'john.doe@example.com',
        createdAt: 'March 15, 2023',
        profilePic: '/api/placeholder/150/150'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);


    const { checkAuth, user } = useAuthStore()

    const [showPasswordFields, setShowPasswordFields] = useState(false);

    // For password fields and validation
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [passwordError, setPasswordError] = useState('');

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
        if (!user)
            checkAuth()
    }, [user])

    useEffect(() => {
        if (user) {
            const date = user.createdAt.split('T')[0]
            setUser({ ...user, createdAt: date })
        }
    }, [user])

    const handleCancel = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsEditing(false);
    };

    const handleSave = () => {
        if (previewUrl) {
            setUser({ ...user, profilePic: previewUrl });
        }
        setIsEditing(false);
        setSelectedFile(null);
    };

    const togglePasswordFields = () => {
        setShowPasswordFields((prev) => !prev);
        setPasswordError('');
        setPasswords({ current: '', new: '', confirm: '' });
    };

    const handlePasswordChange = (field, value) => {
        setPasswords((prev) => ({
            ...prev,
            [field]: value
        }));

        if (field === 'new') {
            if (!passwordRegex.test(value)) {
                setPasswordError('Password must be at least 8 characters, and include a letter and a number.');
            } else if (passwords.confirm && value !== passwords.confirm) {
                setPasswordError('New password and confirmation do not match.');
            } else {
                setPasswordError('');
            }
        }

        if (field === 'confirm') {
            if (value !== passwords.new) {
                setPasswordError('New password and confirmation do not match.');
            } else {
                setPasswordError('');
            }
        }
    };

    const handlePasswordSubmit = () => {
        if (!passwordRegex.test(passwords.new)) {
            setPasswordError('Password must be at least 8 characters, and include a letter and a number.');
            return;
        }
        if (passwords.new !== passwords.confirm) {
            setPasswordError('New password and confirmation do not match.');
            return;
        }
        // Implement actual password update logic here.
        alert('Password changed successfully!');
        setPasswords({ current: '', new: '', confirm: '' });
        setShowPasswordFields(false);
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="flex flex-col md:flex-row">
                        {/* Left Column - Profile Photo */}
                        <div className="md:w-1/3 bg-gradient-to-b from-indigo-600 to-violet-600 p-10 flex flex-col items-center justify-center text-white">
                            <div className="relative group">
                                <div className="h-48 w-48 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-indigo-200">
                                    <img
                                        src="https://www.gravatar.com/avatar/?d=mp&s=200"
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <label htmlFor="profile-upload" className="absolute bottom-2 right-2 bg-white hover:bg-gray-100 text-indigo-600 p-3 rounded-full cursor-pointer shadow-lg transition-all transform hover:scale-110">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                    </svg>
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
                                        className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors shadow-md"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="px-6 py-3 bg-indigo-800 text-white font-medium rounded-lg hover:bg-indigo-900 transition-colors shadow-md"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}

                            <div className="mt-8 text-center">
                                <h2 className="text-3xl font-bold text-white">{userData.username}</h2>
                                <p className="text-indigo-200 mt-2 text-lg">Member since: <br></br> {userData.createdAt}</p>
                            </div>
                        </div>

                        {/* Right Column - Profile Information */}
                        <div className="md:w-2/3 p-10">
                            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mr-3 text-indigo-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                Profile Information
                            </h1>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={userData.username}
                                            readOnly
                                            className="w-full pl-12 px-4 py-4 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                            </svg>
                                        </div>
                                        <input
                                            type="email"
                                            value={userData.email}
                                            readOnly
                                            className="w-full pl-12 px-4 py-4 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Created</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={userData.createdAt.split("T")}
                                            readOnly
                                            className="w-full pl-12 px-4 py-4 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                        />
                                    </div>
                                </div>

                                {/* Change Password Button */}
                                {!showPasswordFields && (
                                    <div className="pt-4">
                                        <button
                                            onClick={togglePasswordFields}
                                            className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md flex items-center justify-center w-full md:w-auto"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                            </svg>
                                            Change Password
                                        </button>
                                    </div>
                                )}

                                {/* Password Change Section */}
                                <div
                                    className={`mt-10 transition-all duration-500 ease-in-out overflow-hidden ${showPasswordFields ? 'max-h-[650px] opacity-100' : 'max-h-0 opacity-0'
                                        } pb-10`}
                                >
                                    <div className="border-t border-gray-200 pt-8">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-indigo-600">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                            </svg>
                                            Change Password
                                        </h2>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type={showCurrent ? "text" : "password"}
                                                        value={passwords.current}
                                                        onChange={(e) => handlePasswordChange('current', e.target.value)}
                                                        className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                                        placeholder="Enter your current password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrent((prev) => !prev)}
                                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-indigo-700"
                                                    >
                                                        {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type={showNew ? "text" : "password"}
                                                        value={passwords.new}
                                                        onChange={(e) => handlePasswordChange('new', e.target.value)}
                                                        className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                                        placeholder="Enter your new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNew((prev) => !prev)}
                                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-indigo-700"
                                                    >
                                                        {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                                {passwordError && (
                                                    <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type={showConfirm ? "text" : "password"}
                                                        value={passwords.confirm}
                                                        onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                                                        className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                                        placeholder="Confirm your new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirm((prev) => !prev)}
                                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-indigo-700"
                                                    >
                                                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                                {passwords.confirm && passwords.new !== passwords.confirm && (
                                                    <p className="mt-1 text-sm text-red-600">Passwords do not match.</p>
                                                )}
                                            </div>

                                            <div className="pt-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                                                <button
                                                    onClick={handlePasswordSubmit}
                                                    className="px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors shadow-md flex items-center justify-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Update Password
                                                </button>
                                                <button
                                                    onClick={togglePasswordFields}
                                                    className="px-6 py-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors shadow-md flex items-center justify-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
