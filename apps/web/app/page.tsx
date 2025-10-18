"use client";
import { useWalletStore } from "@/store/wallet-store";
import Hero from "./(landingpage)/components/Hero";
import { HowItWorksSection } from "./(landingpage)/components/how-it-works";
import Navbar from "./(landingpage)/navbar/page";
import EventPage from "@/components/pages/events/EventPage";
// import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  const { isConnected } = useWalletStore();

  return (
    <div className="min-h-screen  no-scrollbar">
      {/* <div className="w-[1px] absolute min-h-screen border-r-2 border-dashed border-border -top-10 left-52 hidden md:block" />
      <div className="w-[1px] absolute min-h-screen border-r-2 border-dashed border-border -top-10 right-52 hidden md:block" /> */}
      <Navbar />

      <Hero />
    </div>
  );
}
