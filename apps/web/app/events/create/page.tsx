"use client";

import { useState, FormEvent, useEffect } from "react";
import ImageUpload from "@/components/ui/Image-upload";
import { useWalletStore } from "@/store/wallet-store";
import { type PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

interface EventData {
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  location: string;
  wallet: PublicKey | null;
}

export default function CreateEventPage() {
  const { publicKey } = useWallet();

  const [eventData, setEventData] = useState<EventData>({
    title: "",
    description: "",
    imageUrl: "",
    date: "",
    location: "",
    wallet: publicKey,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleImageUpload = (url: string) => {
    setEventData({ ...eventData, imageUrl: url });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!eventData.imageUrl) {
      alert("Please upload an image");
      return;
    }
    if (!publicKey) {
      alert("Please connect your wallet first");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        alert("Event created successfully!");
        // Redirect or reset form
      } else {
        throw new Error("Failed to create event");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Event</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Event Title</label>
          <input
            type="text"
            required
            placeholder="Enter event title"
            value={eventData.title}
            onChange={(e) =>
              setEventData({ ...eventData, title: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            required
            placeholder="Enter event description"
            value={eventData.description}
            onChange={(e) =>
              setEventData({ ...eventData, description: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Event Date</label>
          <input
            type="datetime-local"
            required
            value={eventData.date}
            onChange={(e) =>
              setEventData({ ...eventData, date: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            required
            placeholder="Enter event location"
            value={eventData.location}
            onChange={(e) =>
              setEventData({ ...eventData, location: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Event Image</label>
          <ImageUpload onUploadSuccess={handleImageUpload} />

          {eventData.imageUrl && (
            <div className="mt-4">
              <p className="text-sm text-green-600 mb-2">✓ Image uploaded</p>
              <img
                src={eventData.imageUrl}
                alt="Event preview"
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !eventData.imageUrl}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
                   hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                   transition-colors"
        >
          {isSubmitting ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
