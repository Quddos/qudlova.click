"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HERO_IMAGES = [
  // Unsplash or Pexels royalty-free images
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
];

export default function DashboardPage() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/auth/signin");
      return;
    }
    fetch("/api/blind-date/profile/me")
      .then((res) => res.json())
      .then((data) => setProfile(data.profile));
  }, [isSignedIn, router]);

  // Hero slider animation
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  if (!profile) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Vertical Hero/Slider */}
      <div className="md:w-1/3 w-full flex flex-col items-center justify-center bg-white/60 p-4 md:sticky md:top-0 md:h-screen shadow-lg">
        <div className="w-full h-96 md:h-[70vh] flex items-center justify-center overflow-hidden rounded-xl mb-4 transition-all duration-500">
          <img
            src={HERO_IMAGES[heroIndex]}
            alt="Love & Romance"
            className="object-cover w-full h-full rounded-xl shadow-md animate-fadein"
            style={{ transition: "all 0.7s" }}
          />
        </div>
        <div className="text-center text-lg text-pink-600 font-semibold animate-pulse">
          "Love is the greatest adventure."
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="flex-1 flex flex-col p-6 gap-8">
        {/* Welcome & Profile Summary */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.firstName || user?.username || "Friend"}!</h1>
            <p className="text-gray-600">Ready to make new connections today?</p>
          </div>
          <div className="flex items-center gap-4">
            <img
              src={user?.imageUrl || "/default-avatar.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-pink-400 object-cover"
            />
            <div>
              <div className="font-semibold text-lg">{user?.fullName || user?.username}</div>
              <div className="text-sm text-gray-500">{profile.bio}</div>
              <Link href="/profile">
                <Button size="sm" className="mt-1">Edit Profile</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Next Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/blind-date">
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition cursor-pointer">
              <Heart className="w-10 h-10 text-pink-500 mb-2" />
              <div className="font-bold text-lg mb-1">Find a Match</div>
              <div className="text-gray-500 text-sm text-center">Start your BlindDate journey and meet someone special.</div>
            </div>
          </Link>
          <Link href="/go-stream">
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition cursor-pointer">
              <PlayCircle className="w-10 h-10 text-yellow-500 mb-2" />
              <div className="font-bold text-lg mb-1">Go Live</div>
              <div className="text-gray-500 text-sm text-center">Share your talents and connect with the community in real-time.</div>
            </div>
          </Link>
          <Link href="/dare-to-earn">
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition cursor-pointer">
              <Handshake className="w-10 h-10 text-blue-500 mb-2" />
              <div className="font-bold text-lg mb-1">Accept a Dare</div>
              <div className="text-gray-500 text-sm text-center">Take on fun challenges and earn rewards.</div>
            </div>
          </Link>
        </div>

        {/* Notifications & Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="font-bold text-lg mb-2">Notifications</div>
            <ul className="text-gray-700 text-sm space-y-2">
              <li>💌 You have 2 new matches!</li>
              <li>📅 Upcoming date with Alex on Friday, 7pm.</li>
              <li>🎉 You completed a dare and earned 50 points!</li>
              <li>📝 New message from Taylor.</li>
            </ul>
          </div>
          {/* Calendar */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="font-bold text-lg mb-2">Calendar</div>
            <ul className="text-gray-700 text-sm space-y-2">
              <li>Friday: Date with Alex (7pm)</li>
              <li>Saturday: GoStream Live Event (5pm)</li>
              <li>Sunday: Dare2Earn Challenge (All day)</li>
            </ul>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex gap-4 flex-wrap mt-4">
          <Link href="/profile">
            <Button variant="outline">Edit Profile</Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline">Settings</Button>
          </Link>
          <Button variant="outline" onClick={() => router.push("/auth/signin?signout=true")}>Sign Out</Button>
        </div>
      </div>
    </div>
  );
} 