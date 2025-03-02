import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { IncorrectPasswordError, UserNotFoundError } from "./errors";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      profile(profile) {
        return {
          email: profile.email,
          image: profile.picture,
          name: profile.name,
        };
      },
    }),
    Credentials({
      authorize: async (credentials) => {
        const { email, password } = credentials;

        if (!email || email !== "test@test.com") {
          throw new UserNotFoundError();
        }

        if (!password || password !== "password") {
          throw new IncorrectPasswordError();
        }

        return { email: email as string };
      },
      credentials: {
        email: {},
        password: {},
      },
    }),
  ],
});
