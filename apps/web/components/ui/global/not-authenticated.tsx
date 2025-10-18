"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import WalletButton from "@/components/walletconnectbutton/wallet-button";

export default function NotAuthenticated() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md bg-black border border-white/10 rounded-2xl shadow-lg p-8 space-y-6"
      >
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ type: "spring", stiffness: 80 }}
          className="w-20 h-20 mx-auto flex items-center justify-center bg-white/5 rounded-full border border-white/10"
        >
          <Wallet className="w-10 h-10 text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold text-white">Not Authenticated</h2>
        <p className="text-sm text-white/60">
          You need to connect your wallet to access this feature. Once
          connected, you&apos;ll be able to create and manage your events.
        </p>

        <WalletButton />
      </motion.div>
    </div>
  );
}
