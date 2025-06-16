'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

export default function SignOutButton() {

  const { data: session, status } = useSession();

  const isSignedIn = status === 'authenticated';


  return (
    <button
      onClick={() => {
        if (isSignedIn) {
          signOut({ callbackUrl: '/' });
        } else {
          window.location.href = '/login';
        }
      }}
      className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
    >
      <div className="hidden md:block">
        {isSignedIn ? 'Sign Out' : 'Log In'}
      </div>
    </button>
  );
}
