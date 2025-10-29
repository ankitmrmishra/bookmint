"use client";

import { useState, useEffect } from "react";
import { EventCard } from "./event-card";
import { getEvents } from "@/actions/event-action-fetch-events";
import { CATEGORIES } from "@/components/pages/createEvent/form-event";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, X, Loader2 } from "lucide-react";

type SortOption =
  | "date-asc"
  | "date-desc"
  | "price-asc"
  | "price-desc"
  | "name";

export default function EventPage() {
  const [events, setEvents] = useState<Awaited<ReturnType<typeof getEvents>>>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortOption, setSortOption] = useState<SortOption>("date-asc");

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events by category
  const filteredEvents =
    selectedCategory === "all"
      ? events
      : events.filter((event) => event.category === selectedCategory);

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortOption) {
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "price-asc":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-desc":
        return parseFloat(b.price) - parseFloat(a.price);
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Count events per category
  const categoryCounts = CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = events.filter(
        (event) => event.category === category
      ).length;
      return acc;
    },
    {} as Record<string, number>
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      {/* Header Section */}
      <section className="mb-8">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Discover
          </p>
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">
            Curated Events. Premium Nights.
          </h2>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{events.length} Total Events</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>{CATEGORIES.length} Categories</span>
          </div>
        </div>
      </section>

      {/* Filters and Sorting */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Dropdown */}
        <Select
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value)}
        >
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ({events.length})</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category} ({categoryCounts[category] || 0})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Dropdown */}
        <Select
          value={sortOption}
          onValueChange={(value) => setSortOption(value as SortOption)}
        >
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-asc">Date (Earliest)</SelectItem>
            <SelectItem value="date-desc">Date (Latest)</SelectItem>
            <SelectItem value="price-asc">Price (Low to High)</SelectItem>
            <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {selectedCategory !== "all" && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filter:</span>
          <Badge variant="secondary" className="gap-2">
            {selectedCategory}
            <button
              onClick={() => setSelectedCategory("all")}
              className="ml-1 hover:text-destructive"
              aria-label="Clear filter"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}

      {/* Events Grid */}
      {sortedEvents.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 py-12 text-center">
          <div className="mx-auto max-w-md space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No Events Found</h3>
            <p className="text-sm text-muted-foreground">
              {selectedCategory === "all"
                ? "There are no events available at the moment. Check back soon!"
                : `No events found in the "${selectedCategory}" category. Try browsing other categories.`}
            </p>
            {selectedCategory !== "all" && (
              <Button
                onClick={() => setSelectedCategory("all")}
                className="mt-4"
              >
                View All Events
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {sortedEvents.length} event
            {sortedEvents.length !== 1 ? "s" : ""}
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id as unknown as string}
                title={event.title}
                category={event.category}
                image={event.thumbnailUrl || event.imageUrl}
                rating={0}
                price={parseFloat(event.price)}
                venue={event.venue}
                city={event.city}
                date={new Date(event.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
