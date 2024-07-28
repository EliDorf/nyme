// src/types/user.ts

export type User = {
    clerkId: string;
    creditBalance: number;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
    // Add any other properties that your User model has
  };