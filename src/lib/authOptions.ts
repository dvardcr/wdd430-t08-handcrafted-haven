import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import type { User } from 'next-auth';
import { sql } from 'src/app/lib/data';

const artisans = [
  {
    id: '1',
    name: 'Emma Thompson',
    email: 'emma@example.com',
    password: 'password123',
    artisanId: 1,
  },
  {
    id: '2',
    name: 'James Wilson',
    email: 'james@example.com',
    password: 'password123',
    artisanId: 2,
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    // Artisan login from static array
    CredentialsProvider({
      name: 'Artisan',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const artisan = artisans.find(u => u.email === credentials.email);
        if (artisan && artisan.password === credentials.password) {
          return {
            id: artisan.id,
            name: artisan.name,
            email: artisan.email,
            artisanId: artisan.artisanId,
          } as User & { artisanId: number };
        }
        return null;
      }
    }),

    // User login from DB
    CredentialsProvider({
      name: 'User',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const users = await sql<{
          id: string;
          name: string;
          email: string;
          password_hash: string;
        }[]>`
          SELECT id, name, email, password_hash
          FROM users
          WHERE email = ${credentials.email}
        `;

        const user = users[0];
        // Plain text check (not secure, just for dev/testing)
        if (user && user.password_hash === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          } as User;
        }
        return null;
      }
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Only add artisanId if user has it (artisan login)
      if (user && 'artisanId' in user) {
        token.artisanId = user.artisanId;
      }
      return token;
    },

    async session({ session, token }) {
      // Pass artisanId to the client session object if present
      if (session.user && token.artisanId) {
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
};