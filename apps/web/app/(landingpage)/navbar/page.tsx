"use client";

import { useState } from "react";
import "./wallet.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  Ticket,
  Coins,
  Calendar,
  User,
  Search,
  Wallet,
  Music,
  Trophy,
} from "lucide-react";
import {
  WalletConnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import WalletButton from "@/components/walletconnectbutton/wallet-button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 md:px-7 py-2  w-full border-b-2 border-dashed border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-2 ">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Logo */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
              <Ticket className="h-4 w-4 text-primary" />
            </div>
            <span className="hidden font-bold lg:inline-block text-foreground">
              TicketMint
            </span>
          </Link>
        </div>

        {/* Mobile menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileNav />
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="hidden md:flex md:space-x-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Events
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem>
                    <Music className="mr-2 h-4 w-4" />
                    Concerts
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Trophy className="mr-2 h-4 w-4" />
                    Sports
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="mr-2 h-4 w-4" />
                    Theater
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/marketplace">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Ticket className="mr-2 h-4 w-4" />
                  Marketplace
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Coins className="mr-2 h-4 w-4" />
                    NFT Hub
                    <Badge variant="secondary" className="ml-2 text-xs">
                      New
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem>
                    <Coins className="mr-2 h-4 w-4" />
                    Mint Tickets
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Wallet className="mr-2 h-4 w-4" />
                    My Collection
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <User className="h-4 w-4" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Ticket className="mr-2 h-4 w-4" />
                  My Tickets
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Coins className="mr-2 h-4 w-4" />
                  My NFTs
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

function MobileNav() {
  return (
    <div className="flex flex-col space-y-3 py-10">
      <Link href="/" className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
          <Ticket className="h-4 w-4 text-primary" />
        </div>
        <span className="font-bold text-foreground">TicketMint</span>
      </Link>

      <div className="flex flex-col space-y-2 pt-4">
        <Link href="/events">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Events
          </Button>
        </Link>

        <Link href="/marketplace">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <Ticket className="mr-2 h-4 w-4" />
            Marketplace
          </Button>
        </Link>

        <Link href="/nft-hub">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <Coins className="mr-2 h-4 w-4" />
            NFT Hub
            <Badge variant="secondary" className="ml-auto text-xs">
              New
            </Badge>
          </Button>
        </Link>

        <div className="border-t border-border pt-2 mt-2">
          <Link href="/profile">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </Link>

          <Link href="/my-tickets">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <Ticket className="mr-2 h-4 w-4" />
              My Tickets
            </Button>
          </Link>

          <Link href="/my-nfts">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <Coins className="mr-2 h-4 w-4" />
              My NFTs
            </Button>
          </Link>
        </div>

        <Button className="w-full mt-4">Get Started</Button>
      </div>
    </div>
  );
}
