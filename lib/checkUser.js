import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

const hasClerkBackend = Boolean(process.env.CLERK_SECRET_KEY);

export const checkUser = async () => {
  if (!hasClerkBackend) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "Clerk environment variables are missing. Skipping user lookup."
      );
    }
    return null;
  }

  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
      include: {
        transactions: {
          where: {
            type: "CREDIT_PURCHASE",
            // Only get transactions from current month
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        transactions: {
          create: {
            type: "CREDIT_PURCHASE",
            packageId: "free_user",
            amount: 2,
          },
        },
      },
    });

    return newUser;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};