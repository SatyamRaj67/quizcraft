import { type DefaultSession, type NextAuthConfig } from "next-auth";
import providers from "./providers";
import type { UserRole } from "@/types";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

import { ConvexHttpClient } from "convex/browser";
import { env } from "@/env";

// Initialize a server-side client to interact with Convex
const convex = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: Id<"users">;
      // ...other properties
      role: UserRole;
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    role: UserRole;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await convex.mutation(api.user.updateUserById, {
        id: user.id as Id<"users">,
        data: {
          emailVerified: new Date().getTime(),
        },
      });
    },
  },
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      // Allow OAuth without email verificaion
      if (account?.type !== "credentials") return true;

      if (!user.id) return false;

      const existingUser = await convex.query(api.user.getUserById, {
        id: user.id as Id<"users">,
      });

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) {
        return false;
      }

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await convex.query(
          api.two_factor_confirmation.getTwoFactorConfirmationByUserId,
          {
            userId: existingUser._id,
          },
        );

        if (!twoFactorConfirmation) return false;

        // Delete Two Factor Confirmation for Next SignIn
        convex.mutation(
          api.two_factor_confirmation.deleteTwoFactorConfirmationById, // Assuming you have a `deleteById` mutation
          { id: twoFactorConfirmation._id },
        );
      }

      return true;
    },
    session: ({ session, token }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub as Id<"users">;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    jwt: async ({ token, user, account }) => {
      if (!token.sub) return token;

      // const existingUser = await getUserById(token.sub);
      const existingUser = await convex.query(api.user.getUserById, {
        id: token.sub as Id<"users">,
      });

      if (!existingUser) return token;

      const existingAccount = await convex.query(
        api.account.getAccountByUserId,
        {
          userId: existingUser._id,
        },
      );

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  ...providers,
} satisfies NextAuthConfig;
