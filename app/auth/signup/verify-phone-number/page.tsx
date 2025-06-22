"use client";
import { VerifyPhone } from "@clerk/nextjs";

export default function VerifyPhonePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <VerifyPhone />
    </div>
  );
} 