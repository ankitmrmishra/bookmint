"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster, toast } from "sonner";
import { useAuthStore } from "@/store/user-store";
import { Loader2, LogOut, User as UserIcon, Mail } from "lucide-react";

/**
 * Generates initials from a name string
 * @example "John Doe" -> "JD"
 */
const getInitials = (name: string | null | undefined): string => {
  if (!name) return "U";

  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length >= 2) {
    const firstPart = parts[0];
    const lastPart = parts[parts.length - 1];

    if (firstPart && lastPart) {
      const first = firstPart[0];
      const last = lastPart[0];

      if (first && last) {
        return `${first}${last}`.toUpperCase();
      }
    }
  }

  const firstPart = parts[0];
  if (firstPart && firstPart.length >= 2) {
    return firstPart.slice(0, 2).toUpperCase();
  }

  return name.slice(0, 1).toUpperCase() || "U";
};

/**
 * Truncates email for display
 * @example "user@example.com" -> "user@ex..."
 */
const truncateEmail = (email: string | null | undefined): string => {
  if (!email) return "";
  if (email.length <= 20) return email;
  return `${email.slice(0, 17)}...`;
};

export default function AuthButton() {
  // Auth.js session hook
  const { data: session, status } = useSession();

  // Zustand store for client-side auth state
  const { user, isAuthenticated, hydrateAuth, setLoading, clearAuth } =
    useAuthStore();

  // Local loading state for sign-in operations
  const [isSigningIn, setIsSigningIn] = useState(false);

  /**
   * Sync Auth.js session with Zustand store
   * Runs whenever session or status changes
   */
  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }

    hydrateAuth(session);
  }, [session, status, hydrateAuth, setLoading]);

  /**
   * Handle Google OAuth sign-in
   */
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);

    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in with Google");
      setIsSigningIn(false);
    }
  };

  /**
   * Handle credential-based sign-in
   * Opens the Auth.js sign-in page
   */
  const handleCredentialSignIn = async () => {
    setIsSigningIn(true);

    try {
      await signIn("credentials", {
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (error) {
      console.error("Credential sign-in error:", error);
      toast.error("Failed to sign in");
      setIsSigningIn(false);
    }
  };

  /**
   * Handle user sign-out
   * Clears both Auth.js session and Zustand store
   */
  const handleSignOut = async () => {
    try {
      clearAuth();
      await signOut({ callbackUrl: "/" });
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign-out error:", error);
      toast.error("Failed to sign out");
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <Button variant="ghost" disabled className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        <span className="sr-only">Loading authentication status</span>
      </Button>
    );
  }

  // Authenticated state - show user menu
  if (isAuthenticated && user) {
    return (
      <>
        <Toaster position="bottom-center" richColors closeButton />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full"
              aria-label="User menu"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={user.image ?? undefined}
                  alt={user.name ?? "User avatar"}
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            {/* User info section */}
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.name ?? "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {truncateEmail(user.email)}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* User actions */}
            <DropdownMenuItem asChild>
              <a
                href="/profile"
                className="flex items-center gap-2 cursor-pointer"
              >
                <UserIcon className="h-4 w-4" aria-hidden="true" />
                Profile
              </a>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <a
                href="/settings"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Settings
              </a>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Sign out */}
            <DropdownMenuItem
              onClick={handleSignOut}
              className="gap-2 text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  }

  // Unauthenticated state - show sign-in buttons
  return (
    <>
      <Toaster position="bottom-center" richColors closeButton />

      <div className="flex items-center gap-2">
        {/* Google Sign-In */}
        <Button
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
          variant="outline"
          className="gap-2"
          aria-label="Sign in with Google"
        >
          {isSigningIn ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Signing in...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </>
          )}
        </Button>

        {/* Email/Credential Sign-In */}
        <Button
          onClick={handleCredentialSignIn}
          disabled={isSigningIn}
          variant="default"
          aria-label="Sign in with email"
        >
          Sign in
        </Button>
      </div>
    </>
  );
}
