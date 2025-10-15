import { NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import { getNonce, deleteNonce } from "@/lib/redis";
import { createUser, getUsers } from "@/actions/userAction";
// import your database models/functions
// import { getUserByWallet, createUser } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { walletAddress, signature, nonce, timestamp, walletname, username } =
      await req.json();

    // Validate required fields
    if (!walletAddress || !signature || !nonce || !timestamp) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Step 1: Verify nonce exists in Redis
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

    // Step 2: Reconstruct the exact message that was signed
    const message = `Sign this message to authenticate with your wallet.

Wallet: ${walletAddress}
Nonce: ${nonce}
Timestamp: ${timestamp}

This request will not trigger a blockchain transaction or cost any gas fees.`;

    const messageBytes = new TextEncoder().encode(message);

    // Step 3: Verify the signature
    try {
      const publicKey = new PublicKey(walletAddress);
      const signatureUint8 = new Uint8Array(signature);

      const isValid = nacl.sign.detached.verify(
        messageBytes,
        signatureUint8,
        publicKey.toBytes()
      );

      if (!isValid) {
        await deleteNonce(walletAddress); // Clean up failed attempt
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

    // Step 4: Delete the nonce (prevent replay attacks)
    await deleteNonce(walletAddress);

    // Step 5: Check if user exists in your database
    // const existingUser = await getUserByWallet(walletAddress);

    // Example logic - adapt to your database schema
    const existingUser = await getUsers(walletAddress);
    // Replace with actual DB query

    if (existingUser) {
      // User exists - LOGIN
      // Create session/JWT token here
      // const token = createJWTToken(existingUser);

      return NextResponse.json({
        action: "login",
        message: "Login successful",
        user: {
          id: existingUser.id,
          walletAddress: existingUser.wallet,
          username: existingUser.username,
        },
        // token
      });
    } else {
      // User doesn't exist - SIGNUP FLOW
      if (!username) {
        // Need username for signup
        return NextResponse.json(
          {
            action: "signup_required",
            requiresUsername: true,
            message: "Please provide a username to complete signup",
          },
          { status: 400 }
        );
      }

      // Validate username
      if (username.length < 3 || username.length > 20) {
        return NextResponse.json(
          {
            action: "signup_required",
            usernameError: true,
            message: "Username must be between 3 and 20 characters",
          },
          { status: 400 }
        );
      }

      // Check if username is taken
      // const usernameTaken = await isUsernameTaken(username);
      const usernameTaken = false; // Replace with actual DB query

      if (usernameTaken) {
        return NextResponse.json(
          {
            action: "signup_required",
            usernameError: true,
            message: "Username already taken",
          },
          { status: 400 }
        );
      }

      // Create new user
      // const newUser = await createUser({
      //   walletAddress,
      //   username,
      //   walletname: walletname || 'Unknown',
      // });

      const newUser = {
        id: "123",
        walletAddress,
        username,
      }; // Replace with actual user creation

      // Create session/JWT token
      // const token = createJWTToken(newUser);

      return NextResponse.json({
        action: "signup",
        message: "Account created successfully",
        user: {
          id: newUser.id,
          walletAddress: newUser.walletAddress,
          username: newUser.username,
        },
        // token
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
