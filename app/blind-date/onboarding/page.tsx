"use client";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MapPin, User, Users, Sparkles, Zap, Smile, Globe, Star } from "lucide-react";

const TOP_INTERESTS = ["Hiking", "K-pop", "Anime", "Travel", "Food", "Movies", "Dancing", "Art"];
const GENDER_OPTIONS = [
  { label: "♂️ Bro", value: "Male" },
  { label: "♀️ Queen", value: "Female" },
  { label: "⚧️ Human", value: "Non-binary" },
];
const PERSONALITY_LABELS = [
  "Whimsical Explorer",
  "Romantic Dreamer",
  "Bold Adventurer",
  "Chill Connector",
  "Curious Soul",
  "Passionate Creator",
];

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export default function BlindDateOnboarding() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33);
  const [form, setForm] = useState({
    age: "",
    gender: "",
    location: "",
    interests: [] as string[],
    lookingFor: "",
    bio: "",
  });
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [showMatchPreview, setShowMatchPreview] = useState(false);
  const [personality, setPersonality] = useState<string | null>(null);
  const [socialProof, setSocialProof] = useState(3 + getRandomInt(5));
  const [matchCount, setMatchCount] = useState(5 + getRandomInt(10));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/auth/signin");
      return;
    }
    // Autofill location (mocked for now)
    setForm((f) => ({ ...f, location: "Lagos, Nigeria" }));
  }, [isSignedIn, router]);

  // Progress bar logic
  useEffect(() => {
    setProgress(step === 1 ? 33 : step === 2 ? 66 : 100);
  }, [step]);

  // AI suggestion logic (mocked)
  useEffect(() => {
    if (step === 2 && form.interests.length < 3) {
      setAiSuggestion(
        "Based on 500+ successful matches, adding 2 more interests boosts matches by 30%!"
      );
    } else if (step === 2 && !form.interests.includes("Travel")) {
      setAiSuggestion(
        "Users who list 'Travel' get 40% more dates. Add it?"
      );
    } else {
      setAiSuggestion(null);
    }
  }, [step, form.interests]);

  // Step handlers
  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  // Interest selection
  const toggleInterest = (interest: string) => {
    setForm((f) =>
      f.interests.includes(interest)
        ? { ...f, interests: f.interests.filter((i) => i !== interest) }
        : { ...f, interests: [...f.interests, interest] }
    );
  };

  // Looking for selection
  const setLookingFor = (val: string) => setForm((f) => ({ ...f, lookingFor: val }));

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Save profile
    await fetch("/api/blind-date/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        age: Number(form.age),
      }),
    });
    setLoading(false);
    // Show personality reveal
    setPersonality(PERSONALITY_LABELS[getRandomInt(PERSONALITY_LABELS.length)]);
    setTimeout(() => {
      router.push("/dashboard");
    }, 2500);
  };

  // Step 3: Show match preview (mocked)
  const MatchPreview = () => (
    <div className="flex flex-col items-center gap-4 mt-6">
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden blur-sm">
            <img src={`https://randomuser.me/api/portraits/men/${i + 10}.jpg`} alt="Match" className="object-cover w-full h-full" />
          </div>
        ))}
      </div>
      <div className="text-pink-600 font-semibold">Match Preview: 85% compatibility!</div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-6 relative">
        {/* Progress Bar & Social Proof */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-bold text-pink-700">Profile Strength: {progress}%</span>
            <span className="text-xs font-semibold text-gray-800">{progress < 100 ? `High-quality matches unlock at 100%!` : `You're ready!`}</span>
          </div>
          <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-pink-600 to-purple-700" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 text-xs font-semibold text-blue-700 animate-pulse">
            {socialProof} profiles like yours joined this hour! {matchCount} potential matches waiting—finish to unlock!
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 font-medium">Age</label>
                <Input name="age" type="number" min={18} max={100} value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Gender</label>
                <div className="flex gap-2">
                  {GENDER_OPTIONS.map(opt => (
                    <Button key={opt.value} type="button" variant={form.gender === opt.value ? "default" : "outline"} onClick={() => setForm(f => ({ ...f, gender: opt.value }))}>
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Location</label>
                <div className="flex gap-2 items-center">
                  <Input name="location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
                  <Button type="button" variant="outline" onClick={() => setForm(f => ({ ...f, location: "Lagos, Nigeria" }))}><MapPin className="w-4 h-4" /> Autofill</Button>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <span />
              <Button type="button" onClick={handleNext} disabled={!form.age || !form.gender || !form.location}>Next</Button>
            </div>
            <div className="mt-4 text-center text-green-600 font-semibold animate-bounce">
              Great start! Play a 30-sec game to see your first match teaser!
            </div>
          </>
        )}

        {/* Step 2: Interests & Personality */}
        {step === 2 && (
          <>
            <div>
              <label className="block mb-1 font-bold text-gray-800">Interests</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {TOP_INTERESTS.map(interest => (
                  <Button key={interest} type="button" variant={form.interests.includes(interest) ? "default" : "outline"} onClick={() => toggleInterest(interest)}>
                    {interest}
                  </Button>
                ))}
              </div>
              <Input
                name="interestsInput"
                placeholder="Type to add more interests..."
                onKeyDown={e => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    toggleInterest(e.currentTarget.value.trim());
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
            {aiSuggestion && (
              <div className="mt-2 bg-blue-100 border border-blue-400 rounded p-2 text-blue-900 flex items-center gap-2 font-semibold">
                <Sparkles className="w-4 h-4 text-blue-700" /> {aiSuggestion}
                {aiSuggestion.includes("Travel") && (
                  <Button size="sm" variant="outline" className="ml-2" onClick={() => toggleInterest("Travel")}>Yes</Button>
                )}
              </div>
            )}
            <div className="mt-4">
              <label className="block mb-1 font-bold text-gray-800">Looking For</label>
              <div className="flex gap-2">
                <Button type="button" variant={form.lookingFor === "Relationship" ? "default" : "outline"} onClick={() => setLookingFor("Relationship")}>❤️ Relationship</Button>
                <Button type="button" variant={form.lookingFor === "Friendship" ? "default" : "outline"} onClick={() => setLookingFor("Friendship")}>🤝 Friendship</Button>
              </div>
            </div>
            <div className="mt-4">
              <label className="block mb-1 font-bold text-gray-800">Short Bio</label>
              <textarea name="bio" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} className="w-full border rounded p-2" rows={3} required />
            </div>
            <div className="mt-6 flex justify-between items-center">
              <Button type="button" onClick={handleBack}>Back</Button>
              <Button type="button" onClick={() => { setShowMatchPreview(true); handleNext(); }} disabled={form.interests.length < 2 || !form.lookingFor || !form.bio}>Next</Button>
            </div>
            <div className="mt-4 text-center text-purple-800 font-bold animate-bounce">
              Just 2 more minutes to meet your perfect match!
            </div>
            <div className="mt-4 text-center text-blue-800 text-sm font-semibold">
              Top interests in your area: Hiking, K-pop, Anime. Tap to add!
            </div>
          </>
        )}

        {/* Step 3: Game Teaser & Personality Reveal */}
        {step === 3 && (
          <>
            <div className="flex flex-col items-center gap-4">
              <Zap className="w-10 h-10 text-yellow-500 animate-bounce" />
              <div className="text-xl font-bold text-pink-700">Ready for your first match?</div>
              <div className="text-gray-900 text-center font-semibold">Play the AI Dating Game—your matches get 3x more accurate!</div>
              {showMatchPreview && <MatchPreview />}
              <div className="mt-6">
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving..." : "Finish & Reveal Personality"}</Button>
              </div>
            </div>
          </>
        )}

        {/* Personality Reveal */}
        {personality && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 rounded-xl z-10 animate-fadein">
            <Smile className="w-12 h-12 text-pink-600 mb-2 animate-bounce" />
            <div className="text-2xl font-bold text-purple-800 mb-2">Calculating your Dating Personality...</div>
            <div className="text-lg text-gray-900 mb-4 font-bold">You're a <span className="font-bold text-pink-700">{personality}</span>!</div>
            <div className="text-sm text-gray-700 font-semibold">Best matches: Adventurous, Spontaneous</div>
          </div>
        )}
      </form>
    </div>
  );
} 