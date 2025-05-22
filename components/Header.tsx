import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-sand text-teal shadow">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link href="/" className="text-2xl font-playfair font-bold">Handcrafted Shop</Link>
        <nav className="space-x-6 hidden md:block">
          <Link href="/ceramics" className="hover:underline">Ceramics</Link>
          <Link href="/fibers" className="hover:underline">Fibers</Link>
          <Link href="/jewelry" className="hover:underline">Jewelry</Link>
          <Link href="/home-goods" className="hover:underline">Home Goods</Link>
          <Link href="/more" className="hover:underline">More</Link>
          <Link href="/about" className="hover:underline">About</Link>
        </nav>
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} aria-label="Toggle Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button aria-label="Search" className="hover:text-sand">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <button aria-label="Cart" className="hover:text-sand">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden bg-sand px-6 pb-4">
          <Link href="/ceramics" className="block py-2 hover:underline">Ceramics</Link>
          <Link href="/fibers" className="block py-2 hover:underline">Fibers</Link>
          <Link href="/jewelry" className="block py-2 hover:underline">Jewelry</Link>
          <Link href="/home-goods" className="block py-2 hover:underline">Home Goods</Link>
          <Link href="/more" className="block py-2 hover:underline">More</Link>
          <Link href="/about" className="block py-2 hover:underline">About</Link>
        </nav>
      )}
    </header>
  );
} 