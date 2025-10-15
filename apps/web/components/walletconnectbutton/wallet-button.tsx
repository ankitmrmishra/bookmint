"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import type { PublicKey } from "@solana/web3.js";

// shadcn/ui
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// toasts
import { Toaster, toast } from "sonner";

// store
import { useWalletStore } from "@/store/wallet-store";

// icons
import { Loader2, Copy, LogOut, Wallet, User } from "lucide-react";

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
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [username, setUsername] = useState("");

  // Store signature data when username is needed
  const [pendingSignature, setPendingSignature] = useState<{
    signature: number[];
    nonce: string;
    timestamp: number;
  } | null>(null);

  const notifyError = (message: string) => toast.error(message);
  const notifySuccess = (message: string) => toast.success(message);

  const authenticateWallet = async (usernameInput?: string) => {
    if (!publicKey || !wallet || !signMessage) {
      notifyError("Wallet not fully connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // If we have a pending signature, use it instead of creating a new challenge
      let signature: number[];
      let nonce: string;
      let timestamp: number;

      if (pendingSignature && usernameInput) {
        // Reuse the existing signature
        signature = pendingSignature.signature;
        nonce = pendingSignature.nonce;
        timestamp = pendingSignature.timestamp;
      } else {
        // Step 1: Request a challenge from the backend
        const challengeResponse = await fetch("/api/auth/challenge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletAddress: publicKey.toString(),
          }),
        });

        if (!challengeResponse.ok) {
          const data = await challengeResponse.json().catch(() => ({}));
          notifyError(
            data?.message || "Failed to get authentication challenge"
          );
          await wallet.adapter.disconnect();
          clearWallet();
          return;
        }

        const challengeData = await challengeResponse.json();
        const challengeMessage = challengeData.message;
        nonce = challengeData.nonce;
        timestamp = challengeData.timestamp;

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

        signature = Array.from(signatureUint8);
      }

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
          username: usernameInput || undefined,
        }),
      });

      let data: any = {};
      try {
        data = await authResponse.json();
      } catch {
        notifyError("Unexpected server response");
        await wallet.adapter.disconnect();
        clearWallet();
        setPendingSignature(null);
        return;
      }

      // Handle non-2xx with provided message
      if (!authResponse.ok) {
        if (data?.action === "signup_required" && data?.requiresUsername) {
          // Store the signature for reuse when username is provided
          setPendingSignature({ signature, nonce, timestamp });
          setShowUsernameModal(true);
          notifyError(data?.message || "Username required");
        } else if (data?.action === "signup_required" && data?.usernameError) {
          // Keep the signature, just show error
          setPendingSignature({ signature, nonce, timestamp });
          setShowUsernameModal(true);
          notifyError(data?.message || "Username already taken");
        } else {
          notifyError(data?.message || "Authentication failed");
          await wallet.adapter.disconnect();
          clearWallet();
          setPendingSignature(null);
        }
        return;
      }

      // 2xx cases - Success!
      setPendingSignature(null); // Clear any pending signature

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
        case "signup_required": {
          if (data.requiresUsername) {
            setPendingSignature({ signature, nonce, timestamp });
            setShowUsernameModal(true);
            toast.message("Create a username to finish signup");
          } else if (data.usernameError) {
            setPendingSignature({ signature, nonce, timestamp });
            setShowUsernameModal(true);
            notifyError("Username already taken. Please try another.");
          } else {
            notifyError(data?.message || "Signup required");
            await wallet.adapter.disconnect();
            clearWallet();
            setPendingSignature(null);
          }
          break;
        }
        default: {
          notifyError(data?.message || "Authentication failed");
          await wallet.adapter.disconnect();
          clearWallet();
          setPendingSignature(null);
        }
      }
    } catch (err) {
      console.error("Network error:", err);
      notifyError("Failed to connect to server");
      try {
        await wallet?.adapter?.disconnect?.();
      } catch {}
      clearWallet();
      setPendingSignature(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameSubmit = async () => {
    const name = username.trim();

    if (!name) {
      notifyError("Username is required");
      return;
    }
    if (name.length < 3 || name.length > 20) {
      notifyError("Username must be between 3 and 20 characters");
      return;
    }

    if (!pendingSignature) {
      notifyError(
        "Authentication session expired. Please reconnect your wallet."
      );
      setShowUsernameModal(false);
      return;
    }

    // Call authenticateWallet with the username
    await authenticateWallet(name);

    // Close modal on success
    if (useWalletStore.getState().isConnected) {
      setShowUsernameModal(false);
      setUsername("");
      setPendingSignature(null);
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
        setPendingSignature(null);
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
    setPendingSignature(null);
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

      <Dialog
        open={showUsernameModal}
        onOpenChange={(open) => {
          setShowUsernameModal(open);
          if (!open) {
            setUsername("");
            setError(null);
            setPendingSignature(null);
            // Disconnect wallet if they cancel username creation
            handleDisconnect();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-4 w-4" aria-hidden="true" />
              Choose a username
            </DialogTitle>
            <DialogDescription>
              Create a username to complete your account setup.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. solanafan"
                maxLength={20}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                3–20 characters. Letters, numbers, underscores.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              type="button"
              onClick={() => {
                setShowUsernameModal(false);
                setUsername("");
                setError(null);
                setPendingSignature(null);
                handleDisconnect();
              }}
              variant="ghost"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUsernameSubmit}
              disabled={loading || !username.trim()}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
