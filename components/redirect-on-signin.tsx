"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function RedirectOnSignin() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isSignedIn || !user) return;
    // Only run on homepage or after sign-in
    if (pathname !== "/" && pathname !== "/auth/signin") return;
    // Check if user has a profile
    fetch("/api/blind-date/profile/me")
      .then(async (res) => {
        try {
          return await res.json();
        } catch {
          return { profile: null };
        }
      })
      .then((data) => {
        if (!data.profile) {
          router.replace("/blind-date/onboarding");
        }
      });
  }, [isSignedIn, user, pathname, router]);

  return null;
} 