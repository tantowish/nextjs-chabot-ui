import { prismaClient } from "@/lib/prisma";
import { compare } from "bcrypt";
import { User, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials ?? {};
        if (!email || !password) {
          throw new Error("Missing email or password");
        }

        const user = await prismaClient.user.findFirst({
          where: {
            email: email
          },
        });
        // if user doesn't exist or password doesn't match
        if (!user || !(await compare(password, user.password))) {
          throw new Error("Invalid email or password");
        }

        const transformedUser: User = {
            ...user,
            user_id: user.id.toString(),
            id: user.id.toString(),
        };

        return transformedUser;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
  ],
  callbacks: {
    jwt: ({ token, user, trigger, session }) => {
      if (trigger === "update") {
        // token.selectedLocation = session.selectedLocation;
      }
      // console.log(token)
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.user_id = user.user_id;
        token.image = user.image;
        return token;
      }
      return token;
    },
    session: ({ session, token }) => {
      // console.log(token)
      session.user = token;
      return session;
    },
    async signIn({account, profile, credentials}){
      type profileType = {
          email: string,
          name: string,
          picture: string
      }
      const newProfile: profileType = profile as profileType
      if (account?.provider === "google") {
        if (!profile?.email) {
          throw new Error("No profile email found");
        }

        await prismaClient.user.upsert({
          where: { email: profile.email },
          create: {
            email: profile.email,
            name: profile.name!,
            image: newProfile.picture as string,
            password: "google",
            role: "user",
          },
          update: {
            name: profile.name!,
            image: newProfile.picture as string,
          },
        });

        return true;
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: 'signin', 
    signOut: 'signout',
    error: 'error',
    verifyRequest: 'verify-request',
    newUser: 'new-user',
  },
};
