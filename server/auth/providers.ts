import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import { LoginSchema } from "@/schemas";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { env } from "@/env";

// Initialize a server-side client to interact with Convex
const convex = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);

export default {
  providers: [
    Google,
    GitHub,
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await convex.query(api.user.getUserByEmail, {
            email,
          });

          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) {
            return {
              id: user._id,
              name: user.name || "User",
              email: user.email,
              image: user.image || null,
              role: user.role || "USER",
              isTwoFactorEnabled: user.isTwoFactorEnabled || false,
              isOAuth: false,
            };
          }

          throw new Error("Invalid credentials");
        }

        return null;
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
} satisfies NextAuthConfig;
