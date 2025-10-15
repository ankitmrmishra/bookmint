import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { storeNonce } from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json(
        { message: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Generate a cryptographically secure nonce
    const nonce = randomBytes(32).toString("hex");
    const timestamp = Date.now();

    // Store nonce in Redis with 5-minute expiry
    await storeNonce(walletAddress, nonce);

    // Create the message to be signed
    const message = `Sign this message to authenticate with your wallet.

Wallet: ${walletAddress}
Nonce: ${nonce}
Timestamp: ${timestamp}

This request will not trigger a blockchain transaction or cost any gas fees.`;

    return NextResponse.json({
      message,
      nonce,
      timestamp,
    });
  } catch (error) {
    console.error("Challenge generation error:", error);
    return NextResponse.json(
      { message: "Failed to generate authentication challenge" },
      { status: 500 }
    );
  }
}
