"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { PublicKey } from "@solana/web3.js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useWalletStore } from "@/store/wallet-store";
import NotAuthenticated from "@/components/ui/global/not-authenticated";

import FormSection from "@/components/pages/createEvent/form-event";
import PreviewSection from "@/components/pages/createEvent/preview-event";
import ProgressIndicator from "@/components/pages/createEvent/progress-indicator";
import TipsSection from "@/components/pages/createEvent/tips-section";
import { getUserByWalletAddress } from "@/actions/userAction";

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
  wallet: PublicKey | null;
}

export default function CreateEventPage() {
  const { publicKey } = useWallet();
  const { isConnected, user } = useWalletStore();
  const router = useRouter();

  const [eventData, setEventData] = useState<EventData>({
    title: "",
    description: "",
    category: "",
    imageUrl: "",
    thumbnailUrl: "",
    date: "",
    venue: "",
    city: "",
    price: 0,
    wallet: publicKey,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Authentication check
  useEffect(() => {
    const checkAuthentication = async () => {
      // Check if wallet is connected
      if (!publicKey || !isConnected) {
        setIsAuthorized(false);
        setIsAuthenticating(false);
        return;
      }

      try {
        // Verify user exists in database
        const userData = await getUserByWalletAddress(publicKey.toString());

        if (userData) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          toast.error("User not found", {
            description: "Please register first to create events.",
          });
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setIsAuthorized(false);
        toast.error("Authentication failed", {
          description: "Please try reconnecting your wallet.",
        });
      } finally {
        setIsAuthenticating(false);
      }
    };

    checkAuthentication();
  }, [publicKey, isConnected]);

  // Redirect if not authorized (optional additional security)
  useEffect(() => {
    if (!isAuthenticating && !isAuthorized) {
      // Optional: Redirect to home or login page after a delay
      const timer = setTimeout(() => {
        // router.push("/"); // Uncomment to enable redirect
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticating, isAuthorized, router]);

  const calculateProgress = () => {
    const fields = [
      eventData.title,
      eventData.description,
      eventData.category,
      eventData.date,
      eventData.venue,
      eventData.city,
      eventData.imageUrl,
      eventData.price > 0 ? "set" : "",
    ];
    const completed = fields.filter((field) =>
      typeof field === "string" ? field.trim().length > 0 : !!field
    ).length;
    return Math.round((completed / fields.length) * 100);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!eventData.title.trim()) newErrors.title = "Event title is required";
    if (!eventData.description.trim())
      newErrors.description = "Description is required";
    if (!eventData.category.trim()) newErrors.category = "Category is required";
    if (!eventData.date) newErrors.date = "Event date is required";
    if (!eventData.venue.trim()) newErrors.venue = "Venue is required";
    if (!eventData.city.trim()) newErrors.city = "City is required";
    if (!eventData.price || eventData.price <= 0)
      newErrors.price = "Valid ticket price is required";
    if (!eventData.imageUrl) newErrors.imageUrl = "Event banner is required";
    if (!eventData.thumbnailUrl)
      newErrors.thumbnailUrl = "Event thumbnail is required";
    if (!publicKey) newErrors.wallet = "Please connect your wallet first";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBannerUpload = (url: string) => {
    setEventData({
      ...eventData,
      imageUrl: url,
    });
    if (errors.imageUrl) {
      const newErrors = { ...errors };
      delete newErrors.imageUrl;
      setErrors(newErrors);
    }
  };

  const handleThumbnailUpload = (url: string) => {
    setEventData({
      ...eventData,
      thumbnailUrl: url,
    });
    if (errors.thumbnailUrl) {
      const newErrors = { ...errors };
      delete newErrors.thumbnailUrl;
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Double-check authentication before submission
    if (!isAuthorized) {
      toast.error("Unauthorized", {
        description: "Please authenticate to create events.",
      });
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Ensure we have the current publicKey
    if (!publicKey) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to create events.",
      });
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading("Creating your event...");

    try {
      // Create payload with current publicKey
      const payload = {
        ...eventData,
        wallet: publicKey.toString(), // Convert PublicKey to string
      };

      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.dismiss(loadingToastId);
        toast.success("Event created successfully!", {
          description:
            "Your event is now live and ready to accept registrations.",
        });
        setEventData({
          title: "",
          description: "",
          category: "",
          imageUrl: "",
          thumbnailUrl: "",
          date: "",
          venue: "",
          city: "",
          price: 0,
          wallet: publicKey,
        });
      } else {
        throw new Error("Failed to create event");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.dismiss(loadingToastId);
      toast.error("Failed to create event", {
        description: "Please check your information and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = calculateProgress();

  // Show loading state while authenticating
  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-black dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4 text-gray-400">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Show not authenticated if checks fail
  if (!isAuthorized) {
    return <NotAuthenticated />;
  }

  return (
    <div className="min-h-screen bg-black dark:bg-black">
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/80 dark:bg-black/80 border-b border-white/10 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white dark:text-white">
                    Create Event
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                    Launch your next amazing experience
                  </p>
                </div>
              </div>
              <ProgressIndicator progress={progress} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
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

            {/* Sidebar */}
            <div className="space-y-6 flex flex-col">
              <PreviewSection eventData={eventData} />
              <TipsSection />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
