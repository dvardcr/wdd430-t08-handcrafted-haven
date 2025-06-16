import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import type { User } from 'next-auth';
import { getArtisanByEmail } from '@/app/lib/data';

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      artisanId: number;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    artisanId: number;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const artisan = await getArtisanByEmail(credentials.email);

        if (!artisan) {
          console.log('No user found with that email.');
          return null; // If no user is found, authentication fails
        }

        // 2. Compare the provided password with the hashed password from the database
        const passwordsMatch = credentials.password === artisan.password;

        if (!passwordsMatch) {
          console.log('Passwords do not match.');
          return null; // authentication fails
        }

        console.log('Authentication done for:', artisan.email);
        return {
          id: artisan.id,
          name: artisan.name,
          email: artisan.email,
          artisanId: artisan.artisanId,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.artisanId = user.artisanId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.artisanId = token.artisanId as number;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: Boolean(process.env.PRODUCTION) ? true : false, // true in production
      },
    },
  },
}; 