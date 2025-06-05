import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    artisanId: number;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    artisanId: number;
  }
} 