"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/user-store";
import NotAuthenticated from "@/components/ui/global/not-authenticated";
import FormSection from "@/components/pages/createEvent/form-event";
import PreviewSection from "@/components/pages/createEvent/preview-event";
import ProgressIndicator from "@/components/pages/createEvent/progress-indicator";
import TipsSection from "@/components/pages/createEvent/tips-section";
import { getUserByEmail } from "@/actions/user.actions";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface EventData {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  thumbnailUrl: string;
  date: string;
  venue: string;
  city: string;
  price: number;
  userId: string | null;
}

interface ValidationErrors {
  [key: string]: string;
}

// ============================================================================
// Constants
// ============================================================================

const INITIAL_EVENT_DATA: EventData = {
  title: "",
  description: "",
  category: "",
  imageUrl: "",
  thumbnailUrl: "",
  date: "",
  venue: "",
  city: "",
  price: 0,
  userId: null,
};

const REQUIRED_FIELDS = [
  { key: "title", message: "Event title is required" },
  { key: "description", message: "Description is required" },
  { key: "category", message: "Category is required" },
  { key: "date", message: "Event date is required" },
  { key: "venue", message: "Venue is required" },
  { key: "city", message: "City is required" },
  { key: "imageUrl", message: "Event banner is required" },
  { key: "thumbnailUrl", message: "Event thumbnail is required" },
] as const;

// ============================================================================
// Main Component
// ============================================================================

export default function CreateEventPage() {
  // ---------------------------------------------------------------------------
  // Hooks & State Management
  // ---------------------------------------------------------------------------

  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, isAuthenticated } = useAuthStore();

  // Event form state
  const [eventData, setEventData] = useState<EventData>(INITIAL_EVENT_DATA);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authentication state
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // ---------------------------------------------------------------------------
  // Authentication & Authorization Logic
  // ---------------------------------------------------------------------------

  /**
   * Validates user authentication and authorization
   * Checks both Auth.js session and database user record
   */
  useEffect(() => {
    const validateUserAccess = async () => {
      // Wait for session to load
      if (status === "loading") {
        setIsAuthenticating(true);
        return;
      }

      // Check if user is authenticated
      if (!session || !isAuthenticated || !user) {
        setIsAuthorized(false);
        setIsAuthenticating(false);
        return;
      }

      try {
        // Verify user exists in database with proper permissions
        const dbUser = await getUserByEmail(user.email);

        if (dbUser) {
          setIsAuthorized(true);

          // Initialize event data with user ID
          setEventData((prev) => ({
            ...prev,
            userId: dbUser.id,
          }));
        } else {
          setIsAuthorized(false);
          toast.error("User not found", {
            description: "Please complete your profile to create events.",
          });
        }
      } catch (error) {
        console.error("Authorization error:", error);
        setIsAuthorized(false);
        toast.error("Authorization failed", {
          description: "Unable to verify your account. Please try again.",
        });
      } finally {
        setIsAuthenticating(false);
      }
    };

    validateUserAccess();
  }, [session, status, isAuthenticated, user]);

  /**
   * Redirect unauthorized users after a delay
   * Provides better UX by showing error message first
   */
  useEffect(() => {
    if (!isAuthenticating && !isAuthorized) {
      const redirectTimer = setTimeout(() => {
        router.push("/");
      }, 3000);

      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticating, isAuthorized, router]);

  // ---------------------------------------------------------------------------
  // Form Validation
  // ---------------------------------------------------------------------------

  /**
   * Calculates completion progress based on filled fields
   * @returns Percentage of completed required fields (0-100)
   */
  const calculateProgress = (): number => {
    const fields = [
      eventData.title,
      eventData.description,
      eventData.category,
      eventData.date,
      eventData.venue,
      eventData.city,
      eventData.imageUrl,
      eventData.thumbnailUrl,
      eventData.price > 0 ? "set" : "",
    ];

    const completedFields = fields.filter((field) =>
      typeof field === "string" ? field.trim().length > 0 : Boolean(field)
    ).length;

    return Math.round((completedFields / fields.length) * 100);
  };

  /**
   * Validates all form fields before submission
   * @returns True if form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate required text fields
    REQUIRED_FIELDS.forEach(({ key, message }) => {
      const value = eventData[key as keyof EventData];
      if (typeof value === "string" && !value.trim()) {
        newErrors[key] = message;
      }
    });

    // Validate price field
    if (!eventData.price || eventData.price <= 0) {
      newErrors.price = "Valid ticket price is required";
    }

    // Validate user authentication
    if (!user || !eventData.userId) {
      newErrors.userId = "Please sign in to create events";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Clears specific validation error when field is corrected
   * @param fieldName - Name of the field to clear error for
   */
  const clearFieldError = (fieldName: string): void => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }
  };

  // ---------------------------------------------------------------------------
  // Event Handlers
  // ---------------------------------------------------------------------------

  /**
   * Handles banner image upload
   * @param url - Uploaded image URL from cloud storage
   */
  const handleBannerUpload = (url: string): void => {
    setEventData((prev) => ({
      ...prev,
      imageUrl: url,
    }));
    clearFieldError("imageUrl");
  };

  /**
   * Handles thumbnail image upload
   * @param url - Uploaded thumbnail URL from cloud storage
   */
  const handleThumbnailUpload = (url: string): void => {
    setEventData((prev) => ({
      ...prev,
      thumbnailUrl: url,
    }));
    clearFieldError("thumbnailUrl");
  };

  /**
   * Handles form submission
   * Validates form, creates event via API, and handles response
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Pre-submission authorization check
    if (!isAuthorized) {
      toast.error("Unauthorized", {
        description: "Please sign in to create events.",
      });
      return;
    }

    // Validate all form fields
    if (!validateForm()) {
      toast.error("Validation failed", {
        description: "Please fill in all required fields correctly.",
      });
      return;
    }

    // Final user check
    if (!user || !eventData.userId) {
      toast.error("Authentication required", {
        description: "Please sign in to continue.",
      });
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading("Creating your event...", {
      description: "This may take a few moments.",
    });

    try {
      // Prepare payload for API
      const payload = {
        ...eventData,
        userId: user.id,
      };

      // Submit event creation request
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to create event");
      }

      // Success handling
      toast.dismiss(loadingToastId);
      toast.success("Event created successfully!", {
        description: "Your event is now live and accepting registrations.",
        duration: 5000,
      });

      // Reset form to initial state
      setEventData({
        ...INITIAL_EVENT_DATA,
        userId: user.id,
      });
      setErrors({});

      // Optional: Redirect to event page or dashboard
      // router.push(`/events/${data.eventId}`);
    } catch (error) {
      console.error("Event creation error:", error);

      toast.dismiss(loadingToastId);
      toast.error("Failed to create event", {
        description:
          error instanceof Error
            ? error.message
            : "Please check your information and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Render Logic
  // ---------------------------------------------------------------------------

  const progress = calculateProgress();

  // Loading state - Show while checking authentication
  if (isAuthenticating || status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          <p className="text-sm text-gray-400">Verifying your account...</p>
        </div>
      </div>
    );
  }

  // Unauthorized state - Show error page
  if (!isAuthorized) {
    return <NotAuthenticated />;
  }

  // Main content - Authorized users only
  return (
    <div className="min-h-screen bg-black">
      <div className="relative z-10">
        {/* ===================================================================
            Header Section
            Sticky header with title and progress indicator
        =================================================================== */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Title and subtitle */}
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-xl font-bold text-white sm:text-2xl">
                    Create Event
                  </h1>
                  <p className="text-xs text-gray-400 sm:text-sm">
                    Launch your next amazing experience
                  </p>
                </div>
              </div>

              {/* Progress indicator */}
              <ProgressIndicator progress={progress} />
            </div>
          </div>
        </header>

        {/* ===================================================================
            Main Content Section
            Two-column layout: Form + Preview/Tips
        =================================================================== */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            {/* Left column - Event creation form */}
            <div className="space-y-6 lg:col-span-2">
              <FormSection
                eventData={eventData}
                setEventData={setEventData}
                errors={errors}
                onBannerUpload={handleBannerUpload}
                onThumbnailUpload={handleThumbnailUpload}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>

            {/* Right column - Preview and tips */}
            <div className="flex flex-col space-y-6">
              <PreviewSection eventData={eventData} />
              <TipsSection />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
