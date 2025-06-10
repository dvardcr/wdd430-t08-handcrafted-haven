import 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      artisanId: number;
    }
  }

  interface User {
    id: string;
    name: string;
    email: string;
    artisanId: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    artisanId: number;
  }
} 