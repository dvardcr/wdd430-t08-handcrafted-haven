'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/products'},
  {
    name: 'Artisans',
    href: '/artisans',
  },
  { name: 'Login', href: '/login' },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-800 p-3 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-900 text-sky-400': pathname === link.href,
              },
            )}
            >
            <p className="md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
