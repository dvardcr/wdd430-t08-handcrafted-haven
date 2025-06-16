import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import type { User } from 'next-auth';

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

// This is a mock user database
const users = [
  {
    id: '1',
    name: 'Emma Thompson',
    email: 'emma@example.com',
    password: 'password123', // In production, use hashed passwords
    artisanId: 1,
  },
  {
    id: '2',
    name: 'James Wilson',
    email: 'james@example.com',
    password: 'password123',
    artisanId: 2,
  },
  // Add more users as needed
];

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

        const user = users.find(user => user.email === credentials.email);

        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            artisanId: user.artisanId,
          } as User;
        }

        return null;
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
        session.user.artisanId = token.artisanId;
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