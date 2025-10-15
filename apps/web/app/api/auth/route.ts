import { createUser, getUserByUsername, getUsers } from "@/actions/userAction";
import { db } from "@/db/drizzle";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // here we are getting the props from frontend
    const { walletAddress, walletname, username } = await req.json();

    // checking if anything is missing or not
    if (!walletAddress || !walletname) {
      return NextResponse.json(
        { message: "Full credentials are required" },
        { status: 404 }
      );
    }

    // now we will check if the user already exist by wallet address
    const existingUser = await getUsers(walletAddress);
    if (existingUser) {
      return NextResponse.json(
        {
          message: "User login successful",
          action: "login",
          user: {
            id: existingUser.id,
            walletAddress: existingUser.wallet,
            username: existingUser.username,
            createdAt: existingUser.createdAt,
          },
        },
        { status: 200 }
      );
    } else {
      // here we are checking if the user does not exist amd user has not provided the username

      // if (!username) {
      //   return NextResponse.json(
      //     {
      //       message: "Username required for new user registration",
      //       action: "signup_required",
      //       requiresUsername: true,
      //     },
      //     { status: 422 } // Unprocessable Entity - need more info
      //   );
      // }

      // next step is that user provided username but it has already taken or not

      // const existingusername = await getUserByUsername(username);
      // if (existingusername) {
      //   return NextResponse.json(
      //     {
      //       message: "Username already taken",
      //       action: "signup_required",
      //       usernameError: true,
      //     },
      //     { status: 409 } // Conflict
      //   );
      // }

      const newUser = await createUser({
        wallet: walletAddress, // ✅ Use walletAddress here
        walletname: walletname,
        username: username,
      });

      if (!newUser) {
        return NextResponse.json(
          {
            message: "Failed to create user",
            action: "error",
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        {
          message: "User registration successful",
          action: "signup",
          user: {
            id: newUser.id,
            walletAddress: newUser.wallet,
            username: newUser.username,
            createdAt: newUser.createdAt,
          },
        },
        { status: 201 } // Created
      );
    }
  } catch (error) {
    console.error("Wallet auth error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        action: "error",
      },
      { status: 500 }
    );
  }
}
