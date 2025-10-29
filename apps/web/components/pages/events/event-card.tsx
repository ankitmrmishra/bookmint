"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { RatingStars } from "./rating-stars";
import { LikeButton } from "./like-button";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import Image from "next/image";

type Props = {
  id: string;
  title: string;
  category: string;
  image: string;
  rating: number;
  price: number;
  venue: string;
  city: string;
  date?: string; // Added date prop
  className?: string;
};

export function EventCard(props: Props) {
  const {
    id,
    title,
    category,
    image,
    rating,
    price,
    venue,
    city,
    date,
    className,
  } = props;
  return (
    <Card
      className={cn(
        "group overflow-hidden border-border bg-card text-card-foreground transition-all duration-300 hover:-translate-y-1 hover:border-foreground/40",
        className
      )}
    >
      <Link
        href={`/events/${id}`}
        className="block focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            width={500}
            height={500}
            src={image || "/placeholder.svg"}
            alt={`${title} cover`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {date && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-background/95 px-2.5 py-1.5 text-xs font-medium backdrop-blur-sm">
              <Calendar className="h-3.5 w-3.5" />
              {date}
            </div>
          )}
        </div>
        <CardHeader className="space-y-2 my-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="uppercase tracking-wider">{category}</span>
            <RatingStars rating={rating} />
          </div>
          <h3 className="text-lg font-medium text-pretty">{title}</h3>
        </CardHeader>
        <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{venue}</span>
          <span>{city}</span>
        </CardContent>
      </Link>
      <CardFooter className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-foreground">{"$" + price}</span>
        {/* <LikeButton eventId={id as unknown as n} /> */}
      </CardFooter>
    </Card>
  );
}
