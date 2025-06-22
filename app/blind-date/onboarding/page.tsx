"use client";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BlindDateOnboarding() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
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

  if (!isSignedIn) {
    router.push("/auth/signin");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/blind-date/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
          interests: form.interests.split(",").map((i) => i.trim()),
        }),
      });
      if (res.ok) {
        router.push("/blind-date");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-6">
        <h1 className="text-3xl font-bold mb-2 text-center">Complete Your BlindDate Profile</h1>
        <p className="text-gray-600 text-center mb-6">This helps us match you better!</p>
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
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving..." : "Save & Continue"}</Button>
      </form>
    </div>
  );
} 