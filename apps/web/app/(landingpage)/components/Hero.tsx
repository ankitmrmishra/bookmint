"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import UnMinted from "@/public/heroimages/BuyTicket.svg";
import Minted from "@/public/heroimages/BuyTicketmint.svg";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import CoverImage1 from "@/public/heroimages/1c98d7b14c383baa08739ace93276ff6.jpg";
import CoverImage2 from "@/public/heroimages/6b39d1f300b7dbe70163f29605babc3d.jpg";
import CoverImage3 from "@/public/heroimages/6fef3967cf1cd12be0c296a0605112f2.jpg";
import CoverImage4 from "@/public/heroimages/aeadd1d13613eae600a318f03c96a729.jpg";
import CoverImage5 from "@/public/heroimages/b1e05671841b4e024b6bed409ae06891.jpg";
import CoverImage6 from "@/public/heroimages/dbbdc42dc6ac1c462852564a04825eff.jpg";
import CoverImage7 from "@/public/heroimages/c654fc60852e2647f639609a918dfa24.jpg";
import CoverImage8 from "@/public/heroimages/df861955ff0ae3699ca940166f75581b.jpg";

interface EventData {
  id: string;
  title: string;
  image: StaticImageData;
  description?: string;
}

interface InfiniteScrollingCarouselProps {
  images: StaticImageData[];
  speed?: number; // pixels per second
  cardWidth?: number;
  cardGap?: number;
  pauseOnHover?: boolean;
}

const CARD_WIDTH = 240;
const CARD_GAP = 20;
const DEFAULT_DESKTOP_SPEED = 100; // pixels per second
const DEFAULT_MOBILE_SPEED = 55; // pixels per second

const InfiniteScrollingCarousel: React.FC<InfiniteScrollingCarouselProps> = ({
  images,
  speed,
  cardWidth = CARD_WIDTH,
  cardGap = CARD_GAP,
  pauseOnHover = true,
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect screen size for responsive speed
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Use responsive speed if no speed is provided
  const currentSpeed =
    speed || (isMobile ? DEFAULT_MOBILE_SPEED : DEFAULT_DESKTOP_SPEED);
  const [translateX, setTranslateX] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Create enough duplicates to ensure smooth infinite scroll
  const duplicatedImages: StaticImageData[] = [
    ...images,
    ...images,
    ...images,
    ...images,
  ];

  const totalWidth = (cardWidth + cardGap) * images.length;

  const animate = (currentTime: number): void => {
    if (!isPaused) {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      const deltaMove = (currentSpeed * deltaTime) / 1000; // Convert to pixels per frame

      setTranslateX((prevTranslateX) => {
        const newTranslateX = prevTranslateX - deltaMove;

        // Reset position when we've moved one full set
        if (Math.abs(newTranslateX) >= totalWidth) {
          return 0;
        }

        return newTranslateX;
      });

      lastTimeRef.current = currentTime;
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    lastTimeRef.current = 0;
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, currentSpeed]);

  const handleMouseEnter = (): void => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = (): void => {
    if (pauseOnHover) {
      setIsPaused(false);
      lastTimeRef.current = 0; // Reset time reference
    }
  };

  const handleCardClick = (index: number): void => {
    const actualIndex = index % images.length;
    console.log(`Clicked on event ${actualIndex + 1}`);
    // Add your card click logic here
  };

  return (
    <div className="max-w-[98vw] z-40 bg-black  my-10  overflow-hidden py-8 border-dashed border-white/20 border-t-2 border-b-2 no-scrollbar">
      <div
        ref={carouselRef}
        className="flex will-change-transform "
        style={{
          transform: `translateX(${translateX}px)`,
          gap: `${cardGap}px`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {duplicatedImages.map((image: StaticImageData, index: number) => {
          const actualIndex = index % images.length;

          return (
            <motion.div
              key={`${actualIndex}-${Math.floor(index / images.length)}`}
              className="flex-shrink-0 relative overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer border border-dashed border-white "
              style={{ width: `${cardWidth}px`, height: "300px" }}
              whileHover={{
                scale: 1.05,
                zIndex: 10,
              }}
              transition={{ duration: 0.3 }}
              onClick={() => handleCardClick(index)}
            >
              <Image
                src={image}
                alt={`Event ${actualIndex + 1}`}
                fill
                className="object-cover"
                sizes={`${cardWidth}px`}
                priority={index < images.length * 2} // Prioritize first two sets
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default function Hero() {
  const [isMinted, setIsMinted] = useState<boolean>(false);

  const handleMint = (): void => {
    if (!isMinted) {
      setIsMinted(true);
    }
  };

  const eventImages: StaticImageData[] = [
    CoverImage1,
    CoverImage2,
    CoverImage3,
    CoverImage4,
    CoverImage5,
    CoverImage6,
    CoverImage7,
    CoverImage8,
  ];

  const handleExploreEvents = (): void => {
    console.log("Explore events clicked");
    // Add your navigation logic here
  };

  const handleLearnMore = (): void => {
    console.log("Learn more clicked");
    // Add your learn more logic here
  };

  return (
    <div className="flex flex-col justify-center items-center md:p-10 relative h-full ">
      {/* Header text and parts */}

      <div className="headercomp px-2 md:py-10 md:max-w-5xl">
        <h1 className="text-4xl font-bold mb-4 text-primary/60 text-start md:text-center md:text-7xl">
          Transform Your<span className="text-primary"> Event Experience</span>{" "}
          Into Digital Assets
        </h1>
        <p className="text-lg md:text-2xl mb-6 text-muted-foreground text-start md:text-center">
          Buy <span className="text-primary">event tickets</span> and{" "}
          <span className="text-primary">mint</span> them as exclusive{" "}
          <span className="text-primary"> NFTs.</span> Own your memories, trade
          your experiences, and unlock exclusive perks in the music
          metaverse.{" "}
        </p>
        <div className="CTAbuttons flex md:justify-center justify-start align-middle items-center gap-4">
          <Button
            className="rounded-none font-semibold text-lg"
            onClick={handleExploreEvents}
          >
            Explore Events <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="rounded-none text-lg"
            onClick={handleLearnMore}
          >
            Learn More
          </Button>
        </div>
      </div>

      <div className="ticketshowcase flex flex-col justify-center align-middle items-center w-full max-w-7xl ">
        <InfiniteScrollingCarousel
          images={eventImages}
          cardWidth={320}
          cardGap={20}
          pauseOnHover={true}
        />
      </div>
    </div>
  );
}
