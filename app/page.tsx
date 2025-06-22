"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, Heart, Handshake } from "lucide-react";
import { UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { RedirectOnSignin } from "@/components/redirect-on-signin";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function Home() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  // Handler for Start Your Journey button
  const handleStartJourney = useCallback(async () => {
    if (!isSignedIn) {
      router.push("/auth/signin");
      return;
    }
    // Check if user has a profile
    let data = { profile: null };
    try {
      const res = await fetch("/api/blind-date/profile/me");
      data = await res.json();
    } catch {
      data = { profile: null };
    }
    if (!data.profile) {
      router.push("/blind-date/onboarding");
    } else {
      router.push("/profile");
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 text-gray-800">
      <RedirectOnSignin />
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-purple-600">QudMeetBDate</div>
        <div className="flex gap-4 items-center">
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonPopoverCard: "!p-0",
                },
              }}
              userProfileMode="navigation"
              userProfileUrl="/profile"
            />
            <Link href="/profile" className="ml-2 text-sm font-medium text-purple-700 hover:underline">
              Profile
            </Link>
          </SignedIn>
          <SignedOut>
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </SignedOut>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Find Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              {" "}
              Perfect Match
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of people who have found meaningful connections
            through our intelligent matching system.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3" onClick={handleStartJourney}>
              Start Your Journey
            </Button>
          </div>
        </div>

        {/* Core Features Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="text-lg text-gray-600 mt-2">
              Three unique ways to connect and earn.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {/* dnilBDate */}
            <div className="bg-white/60 p-8 rounded-xl shadow-lg border border-purple-100 backdrop-blur-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">dnilBDate</h3>
              <p className="text-gray-600 mb-6">
                Play our IQ game to find a compatible match, schedule a date,
                and see where it goes.
              </p>
              <Link href="/blind-date">
                <Button variant="outline">
                  Find a Match <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* GoStream */}
            <div className="bg-white/60 p-8 rounded-xl shadow-lg border border-yellow-100 backdrop-blur-sm">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlayCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">GoStream</h3>
              <p className="text-gray-600 mb-6">
                Go live, share your talents, and connect with a vibrant
                community in real-time.
              </p>
              <Link href="/go-stream">
                <Button variant="outline">
                  Go Live <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Dare2Earn */}
            <div className="bg-white/60 p-8 rounded-xl shadow-lg border border-blue-100 backdrop-blur-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Dare2Earn</h3>
              <p className="text-gray-600 mb-6">
                Accept exciting dares, complete tasks, and earn rewards while
                having fun.
              </p>
              <Link href="/dare-to-earn">
                <Button variant="outline">
                  Accept a Dare <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2024 QudMeetBDate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
