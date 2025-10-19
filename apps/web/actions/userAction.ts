"use server";
import { usersTable } from "@/db/users.schema";
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

export const getUserByWalletAddress = async (wallet: string) => {
  try {
    const data = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.wallet, wallet))
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
}) => {
  try {
    const newUser = await db
      .insert(usersTable)
      .values({
        wallet: userData.wallet,
        name: userData.walletname || null,
      })
      .returning();

    return newUser[0] || null;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
