// components/lecturer/Avatar.tsx
"use client";

import { useState, useEffect } from "react";

interface AvatarProps {
  size?: "small" | "large"; // small for header, large for settings
  name: string; // for initials fallback
}

export default function LecturerAvatar({ size = "small", name }: AvatarProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Fetch photo from backend (replace with real API later)
    const fetchPhoto = async () => {
      try {
        const res = await fetch("/api/lecturer/photo");
        if (res.ok) {
          const data = await res.json();
          setPhotoUrl(data.photoUrl || null);
        }
      } catch (err) {
        console.error("Failed to load photo");
      }
    };

    fetchPhoto();
  }, []);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizeClass = size === "small" ? "w-10 h-10 text-lg" : "w-24 h-24 text-3xl";

  return (
    <div className={`${sizeClass} rounded-full overflow-hidden border-4 border-gray-200`}>
      {photoUrl ? (
        <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
          {initials}
        </div>
      )}
    </div>
  );
}