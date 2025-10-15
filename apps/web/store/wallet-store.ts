import { create } from "zustand";
import { type PublicKey } from "@solana/web3.js";
import { type Wallet } from "@solana/wallet-adapter-react";

// User type for storing authenticated user data
export interface User {
  id: number;
  walletAddress: string;
  username: string;
  name?: string | null;
  createdAt?: Date | null;
}

type WalletState = {
  walletAddress: PublicKey | null;
  wallet: Wallet | null;
  isConnected: boolean;
  user: User | null;
};

type WalletActions = {
  updateAddress: (walletAddress: PublicKey | null) => void;
  updateWallet: (wallet: Wallet | null) => void;
  setConnected: (isConnected: boolean) => void;
  setUser: (user: User | null) => void;
  clearWallet: () => void;
};

export const useWalletStore = create<WalletState & WalletActions>((set) => ({
  // State
  walletAddress: null,
  wallet: null,
  isConnected: false,
  user: null,

  // Actions
  updateAddress: (walletAddress) => set({ walletAddress }),

  updateWallet: (wallet) => set({ wallet }),

  setConnected: (isConnected) => set({ isConnected }),

  setUser: (user) => set({ user }),

  clearWallet: () =>
    set({
      walletAddress: null,
      wallet: null,
      isConnected: false,
      user: null,
    }),
}));
