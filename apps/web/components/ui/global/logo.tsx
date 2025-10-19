"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

interface LogoProps {
  size?: number; // optional prop to control logo size
  showText?: boolean; // toggle text display
}

const Logo: React.FC<LogoProps> = ({ size = 40, showText = true }) => {
  return (
    <Link
      href="/"
      className="flex items-center space-x-2 hover:opacity-90 transition-opacity duration-200"
    >
      <Image
        src="/logo.svg"
        alt="BookMint Logo"
        width={size}
        height={size}
        priority
      />
      {showText && (
        <span className="font-bold text-xl text-white tracking-wide">
          Book<span className="">Mint</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
