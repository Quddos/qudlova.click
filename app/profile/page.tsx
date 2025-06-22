"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    bio: "",
    age: "",
    gender: "",
    location: "",
    interests: "",
    lookingFor: "",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/auth/signin");
      return;
    }
    fetch("/api/blind-date/profile/me")
      .then(async (res) => {
        try {
          return await res.json();
        } catch {
          return { profile: null };
        }
      })
      .then((data) => {
        if (data.profile) {
          setForm({
            bio: data.profile.bio || "",
            age: data.profile.age?.toString() || "",
            gender: data.profile.gender || "",
            location: data.profile.location || "",
            interests: (data.profile.interests || []).join(", ") || "",
            lookingFor: data.profile.lookingFor || "",
          });
        }
        setLoaded(true);
      });
  }, [isSignedIn, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/blind-date/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        age: Number(form.age),
        interests: form.interests.split(",").map((i) => i.trim()),
      }),
    });
    setLoading(false);
    router.refresh();
  };

  if (!loaded) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-6">
        <h1 className="text-3xl font-bold mb-2 text-center">Your Profile</h1>
        <div>
          <label className="block mb-1 font-medium">Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full border rounded p-2" rows={3} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Age</label>
            <Input name="age" type="number" min={18} max={100} value={form.age} onChange={handleChange} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Gender</label>
            <Input name="gender" value={form.gender} onChange={handleChange} placeholder="e.g. Male, Female, Non-binary" required />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Location</label>
          <Input name="location" value={form.location} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Interests (comma separated)</label>
          <Input name="interests" value={form.interests} onChange={handleChange} placeholder="e.g. Music, Sports, Art" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Looking For</label>
          <Input name="lookingFor" value={form.lookingFor} onChange={handleChange} placeholder="e.g. Friendship, Relationship" required />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
      </form>
    </div>
  );
} 