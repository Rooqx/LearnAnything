"use client";

import { useState } from "react";
import { Edit2, X, Camera, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const [instituteName, setInstituteName] = useState("John Doe");
  const [phone, setPhone] = useState("+234 823 456 7890");
  const [location, setLocation] = useState("Lagos, Nigeria");
  const [instituteLevel, setInstituteLevel] = useState("Mid level");

  const [editing, setEditing] = useState({
    instituteName: false,
    phone: false,
    location: false,
    instituteLevel: false,
  });

  // Photo upload state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const startEdit = (field: keyof typeof editing) => {
    setEditing((prev) => ({ ...prev, [field]: true }));
  };

  const cancelEdit = (field: keyof typeof editing) => {
    setEditing((prev) => ({ ...prev, [field]: false }));
  };

  const saveEdit = (field: keyof typeof editing) => {
    setEditing((prev) => ({ ...prev, [field]: false }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Simulate upload
    setIsUploading(true);
    setTimeout(() => setIsUploading(false), 1500);
  };

  const removePhoto = () => {
    setPhotoPreview(null);
  };

  const avatarLetter = photoPreview ? null : instituteName.charAt(0).toUpperCase();

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Account Settings</h2>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
          {photoPreview ? (
            <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-lg">
              {avatarLetter}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile Information</h3>
          <p className="text-gray-600 mb-8">
            Your relevant profile information will be used in presenting your test and exams
          </p>

          {/* Profile Picture */}
          <div className="flex items-center gap-8 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-3xl font-medium text-gray-600">
                    {avatarLetter}
                  </div>
                )}
              </div>
              {photoPreview && (
                <button
                  onClick={removePhoto}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div>
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 inline-flex">
                  {isUploading ? "Uploading..." : (
                    <>
                      <Camera className="w-4 h-4" />
                      Change photo
                    </>
                  )}
                </div>
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <p className="text-sm text-gray-500 mt-2">Min 400 x 400px, PNG or JPEG formats</p>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Institute Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institute Name</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  {instituteName}
                </div>
                <button onClick={() => startEdit("instituteName")} className="text-gray-500 hover:text-gray-700">
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  johndoe@gmail.com
                </div>
                <Edit2 className="w-5 h-5 text-gray-300" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  {phone}
                </div>
                <button onClick={() => startEdit("phone")} className="text-gray-500 hover:text-gray-700">
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="flex items-center gap-3">
                {editing.location ? (
                  <div className="flex-1 flex gap-3">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button onClick={() => cancelEdit("location")} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                      Cancel
                    </button>
                    <button onClick={() => saveEdit("location")} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      {location}
                    </div>
                    <button onClick={() => startEdit("location")} className="text-gray-500 hover:text-gray-700">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Institute Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institute Level</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  {instituteLevel}
                </div>
                <button onClick={() => startEdit("instituteLevel")} className="text-gray-500 hover:text-gray-700">
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Institute Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institute Type</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  School
                </div>
                <Edit2 className="w-5 h-5 text-gray-300" />
              </div>
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                •••••••••
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="flex items-center gap-3">
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Edit2 className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 font-medium text-lg">Delete my account</p>
              <p className="text-gray-600">Permanently delete my account and remove all data</p>
            </div>
            <button className="px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}