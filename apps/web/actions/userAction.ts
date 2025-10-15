"use server";
import { usersTable } from "@/db/(auth)/users-schema";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";

export const getUsers = async (walletAddress: string) => {
  try {
    const data = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.wallet, walletAddress))
      .limit(1);
    return data[0] || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const data = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);
    return data[0] || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const createUser = async (userData: {
  wallet: string;
  walletname?: string;
  username: string;
}) => {
  try {
    const newUser = await db
      .insert(usersTable)
      .values({
        wallet: userData.wallet,
        name: userData.walletname || null,
        username: userData.username,
      })
      .returning();

    return newUser[0] || null;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
