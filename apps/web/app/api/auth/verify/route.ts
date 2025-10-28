import { NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import { getNonce, deleteNonce } from "@/lib/redis";
import { createUser, getUsers } from "@/actions/user.actions";

export async function POST(req: Request) {
  try {
    const { walletAddress, signature, nonce, timestamp, walletname } =
      await req.json();

    if (!walletAddress || !signature || !nonce || !timestamp) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const storedNonce = await getNonce(walletAddress);
    if (!storedNonce) {
      return NextResponse.json(
        {
          message:
            "Authentication challenge expired or not found. Please try again.",
        },
        { status: 401 }
      );
    }

    if (storedNonce !== nonce) {
      return NextResponse.json(
        { message: "Invalid authentication challenge" },
        { status: 401 }
      );
    }

    const message = `Sign this message to authenticate with your wallet.\n\nWallet: ${walletAddress}\nNonce: ${nonce}\nTimestamp: ${timestamp}\n\nThis request will not trigger a blockchain transaction or cost any gas fees.`;

    const messageBytes = new TextEncoder().encode(message);

    try {
      const publicKey = new PublicKey(walletAddress);
      const signatureUint8 = new Uint8Array(signature);

      const isValid = nacl.sign.detached.verify(
        messageBytes,
        signatureUint8,
        publicKey.toBytes()
      );

      if (!isValid) {
        await deleteNonce(walletAddress);
        return NextResponse.json(
          { message: "Invalid signature. Authentication failed." },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error("Signature verification error:", error);
      await deleteNonce(walletAddress);
      return NextResponse.json(
        { message: "Signature verification failed" },
        { status: 401 }
      );
    }

    await deleteNonce(walletAddress);

    const existingUser = await getUsers(walletAddress);

    if (existingUser) {
      return NextResponse.json({
        action: "login",
        message: "Login successful",
        user: {
          id: existingUser.id,
          walletAddress: existingUser.wallet,
        },
      });
    } else {
      const newUser = await createUser({
        wallet: walletAddress,
        walletname: walletname || "Unknown",
      });

      return NextResponse.json({
        action: "signup",
        message: "Account created successfully",
        user: {
          id: newUser?.id,
          walletAddress: newUser?.wallet,
        },
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { message: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
