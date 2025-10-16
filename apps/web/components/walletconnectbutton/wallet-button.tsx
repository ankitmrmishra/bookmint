"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import type { PublicKey } from "@solana/web3.js";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Toaster, toast } from "sonner";
import { useWalletStore } from "@/store/wallet-store";
import { Loader2, Copy, LogOut, Wallet } from "lucide-react";

const truncateAddress = (address: PublicKey | null) => {
  if (!address) return "";
  const str = address.toString();
  return `${str.slice(0, 4)}...${str.slice(-4)}`;
};

export default function WalletButton() {
  const { connected, publicKey, wallet, signMessage } = useWallet();
  const {
    walletAddress,
    updateAddress,
    updateWallet,
    setConnected,
    clearWallet,
  } = useWalletStore();

  const [loading, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  const notifyError = (message: string) => toast.error(message);
  const notifySuccess = (message: string) => toast.success(message);

  const authenticateWallet = async () => {
    if (!publicKey || !wallet || !signMessage) {
      notifyError("Wallet not fully connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Request a challenge from the backend
      const challengeResponse = await fetch("/api/auth/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: publicKey.toString() }),
      });

      if (!challengeResponse.ok) {
        const data = await challengeResponse.json().catch(() => ({}));
        notifyError(data?.message || "Failed to get authentication challenge");
        await wallet.adapter.disconnect();
        clearWallet();
        return;
      }

      const challengeData = await challengeResponse.json();
      const challengeMessage = challengeData.message;
      const nonce = challengeData.nonce;
      const timestamp = challengeData.timestamp;

      // Step 2: Sign the challenge message
      const messageBytes = new TextEncoder().encode(challengeMessage);
      let signatureUint8: Uint8Array;

      try {
        signatureUint8 = await signMessage(messageBytes);
      } catch (signError) {
        console.error("Signature error:", signError);
        notifyError("Signature rejected. Please try again.");
        await wallet.adapter.disconnect();
        clearWallet();
        return;
      }

      const signature = Array.from(signatureUint8);

      // Step 3: Send the signature to verify and authenticate
      const authResponse = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          walletname: wallet.adapter.name,
          signature,
          nonce,
          timestamp,
        }),
      });

      let data: any = {};
      try {
        data = await authResponse.json();
      } catch {
        notifyError("Unexpected server response");
        await wallet.adapter.disconnect();
        clearWallet();
        return;
      }

      if (!authResponse.ok) {
        notifyError(data?.message || "Authentication failed");
        await wallet.adapter.disconnect();
        clearWallet();
        return;
      }

      switch (data.action) {
        case "login": {
          updateAddress(publicKey);
          updateWallet(wallet);
          setConnected(true);
          notifySuccess("Welcome back!");
          break;
        }
        case "signup": {
          updateAddress(publicKey);
          updateWallet(wallet);
          setConnected(true);
          notifySuccess("Account created successfully");
          break;
        }
        default: {
          notifyError(data?.message || "Authentication failed");
          await wallet.adapter.disconnect();
          clearWallet();
        }
      }
    } catch (err) {
      console.error("Network error:", err);
      notifyError("Failed to connect to server");
      try {
        await wallet?.adapter?.disconnect?.();
      } catch {}
      clearWallet();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      if (connected && publicKey && wallet) {
        updateAddress(publicKey);
        updateWallet(wallet);
        authenticateWallet();
      } else {
        clearWallet();
      }
    } catch (error) {
      console.error("Error updating wallet state:", error);
      notifyError("Something went wrong with the wallet state");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, publicKey, wallet]);

  const handleCopy = async () => {
    if (!walletAddress) return;
    try {
      await navigator.clipboard.writeText(walletAddress.toString());
      notifySuccess("Address copied");
    } catch {
      notifyError("Failed to copy address");
    }
  };

  const handleDisconnect = async () => {
    try {
      await wallet?.adapter?.disconnect?.();
    } catch {}
    clearWallet();
    toast.message("Disconnected");
  };

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="flex items-center">
        {connected && walletAddress ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="default"
                disabled={loading}
                aria-label="Wallet menu"
                className="gap-2"
              >
                {loading ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    {"Connecting..."}
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4" aria-hidden="true" />
                    {truncateAddress(walletAddress)}
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                {wallet?.adapter?.name ?? "Wallet"}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCopy} className="gap-2">
                <Copy className="h-4 w-4" aria-hidden="true" />
                Copy address
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDisconnect}
                className="gap-2 text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <WalletMultiButton className="wallet-button !h-9 !px-4 !rounded-md !bg-primary !text-primary-foreground hover:!bg-primary/90 focus:!ring-2 focus:!ring-ring focus:!ring-offset-2 !ring-offset-background" />
        )}
      </div>
    </>
  );
}
