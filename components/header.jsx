import React from "react";
import { Button } from "./ui/button";
import {
  Calendar,
  CreditCard,
  ShieldCheck,
  Stethoscope,
  User,
} from "lucide-react";
import Link from "next/link";
import { AuthButtons } from "./auth-buttons";

import { checkUser } from "@/lib/checkUser";
import { Badge } from "./ui/badge";
import { checkAndAllocateCredits } from "@/actions/credits";
import Image from "next/image";

export default async function Header() {
  const clerkFrontendConfigured =
    Boolean(process.env.CLERK_PUBLISHABLE_KEY) ||
    Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  const user = await checkUser();

  if (user?.role === "PATIENT") {
    await checkAndAllocateCredits(user);
  }

  const showCreditsBadge = !user || user.role !== "ADMIN";
  const creditsLabel =
    user && user.role !== "ADMIN"
      ? `${user.credits}${
          user.role === "PATIENT" ? " Credits" : " Earned Credits"
        }`
      : "Pricing";
  const creditsHref =
    user?.role === "PATIENT" ? "/pricing" : user ? "/doctor" : "/pricing";

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Image
            src="/logo-single.png"
            alt="Medimeet Logo"
            width={200}
            height={60}
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {user?.role === "ADMIN" && (
            <>
              <Button
                asChild
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <Link href="/admin">
                  <ShieldCheck className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              </Button>
              <Button asChild variant="ghost" className="md:hidden w-10 h-10 p-0">
                <Link href="/admin">
                  <ShieldCheck className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}

          {user?.role === "DOCTOR" && (
            <>
              <Button
                asChild
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <Link href="/doctor">
                  <Stethoscope className="h-4 w-4" />
                  Doctor Dashboard
                </Link>
              </Button>
              <Button asChild variant="ghost" className="md:hidden w-10 h-10 p-0">
                <Link href="/doctor">
                  <Stethoscope className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}

          {user?.role === "PATIENT" && (
            <>
              <Button
                asChild
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <Link href="/appointments">
                  <Calendar className="h-4 w-4" />
                  My Appointments
                </Link>
              </Button>
              <Button asChild variant="ghost" className="md:hidden w-10 h-10 p-0">
                <Link href="/appointments">
                  <Calendar className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}

          {user?.role === "UNASSIGNED" && (
            <>
              <Button
                asChild
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <Link href="/onboarding">
                  <User className="h-4 w-4" />
                  Complete Profile
                </Link>
              </Button>
              <Button asChild variant="ghost" className="md:hidden w-10 h-10 p-0">
                <Link href="/onboarding">
                  <User className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}

          {showCreditsBadge && (
            <Link
              href={creditsHref}
              className="inline-flex items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Badge
                variant="outline"
                className="h-9 bg-emerald-900/20 border-emerald-700/30 px-3 py-1 flex items-center gap-2"
              >
                <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">
                  {user && user.role !== "ADMIN" ? (
                    <>
                      {user.credits}
                      <span className="hidden md:inline">
                        {user.role === "PATIENT" ? " Credits" : " Earned Credits"}
                      </span>
                    </>
                  ) : (
                    creditsLabel
                  )}
                </span>
              </Badge>
            </Link>
          )}

          {clerkFrontendConfigured && (
            <AuthButtons
              showSignIn={!user}
              showUserButton={!!user}
            />
          )}
        </div>
      </nav>
    </header>
  );
}