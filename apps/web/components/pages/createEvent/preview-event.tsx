"use client";

import { motion, useScroll, useTransform } from "framer-motion";

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
}

interface PreviewSectionProps {
  eventData: EventData;
}

export default function PreviewSection({ eventData }: PreviewSectionProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    if (!price || price === 0) return "Free";
    return `$${price.toFixed(2)}`;
  };

  // 🧭 Track scroll position
  const { scrollYProgress } = useScroll();

  // 🎚️ Map scroll progress (0 → top, 1 → bottom) to scale values
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <motion.div
      style={{ scale }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-24 animate-in fade-in slide-in-from-right-4 duration-500 -z-50"
    >
      <div className="bg-black rounded-xl border border-white/30 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        {/* Preview Header */}
        <div className="px-4 sm:px-6 py-4 bg-black border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Event Preview
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            This is how your event will appear
          </p>
        </div>

        {/* Preview Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Banner Image */}
          {eventData.imageUrl ? (
            <div className="relative rounded-lg overflow-hidden h-40 bg-black">
              <img
                src={eventData.imageUrl || "/placeholder.svg"}
                alt="Event preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

              {/* Date badge on banner */}
              {eventData.date && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-background/95 px-2.5 py-1.5 text-xs font-medium backdrop-blur-sm">
                  <span>📅</span>
                  {formatDate(eventData.date)}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden h-40 bg-white/10 flex items-center justify-center">
              <span className="text-4xl">🖼️</span>
            </div>
          )}

          <div className="space-y-3">
            {/* Category and Title */}
            <div className="space-y-2">
              {eventData.category ? (
                <span className="inline-block text-xs uppercase tracking-wider text-muted-foreground">
                  {eventData.category}
                </span>
              ) : (
                <div className="h-4 bg-white/10 rounded animate-pulse w-20" />
              )}

              {eventData.title ? (
                <h4 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2">
                  {eventData.title}
                </h4>
              ) : (
                <div className="h-6 bg-white/10 rounded animate-pulse" />
              )}
            </div>

            {/* Description */}
            {eventData.description ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                {eventData.description}
              </p>
            ) : (
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded animate-pulse" />
                <div className="h-4 bg-white/10 rounded animate-pulse w-5/6" />
              </div>
            )}

            {/* Venue and City */}
            <div className="pt-3 space-y-2 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                {eventData.venue ? (
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span className="line-clamp-1">{eventData.venue}</span>
                  </div>
                ) : (
                  <div className="h-4 bg-white/10 rounded animate-pulse w-24" />
                )}

                {eventData.city ? (
                  <span className="text-xs">{eventData.city}</span>
                ) : (
                  <div className="h-4 bg-white/10 rounded animate-pulse w-16" />
                )}
              </div>
            </div>

            {/* Price */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
              {eventData.price !== undefined ? (
                <span className="text-lg font-semibold text-slate-900 dark:text-white">
                  {formatPrice(eventData.price)}
                </span>
              ) : (
                <div className="h-6 bg-white/10 rounded animate-pulse w-16" />
              )}

              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ⭐ 0.0
                </span>
              </div>
            </div>

            {/* Thumbnail Preview (if different from banner) */}
            {eventData.thumbnailUrl &&
              eventData.thumbnailUrl !== eventData.imageUrl && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    Thumbnail Preview:
                  </p>
                  <div className="relative rounded-lg overflow-hidden h-24 bg-black">
                    <img
                      src={eventData.thumbnailUrl}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
