import React, { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      if (email.includes('@')) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    }, 1000);
  };

  return (
    <footer className="bg-teal text-white py-8 mt-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="font-playfair mb-2">Contact Us</h4>
          <p>25 Sagamore Rd<br />Worcester, MA 01605<br />508-753-8183 ext 305</p>
        </div>
        <div>
          <h4 className="font-playfair mb-2">Quick Links</h4>
          <ul>
            <li><a href="#" className="hover:underline">Shop Hours</a></li>
            <li><a href="#" className="hover:underline">Worcester Center for Crafts</a></li>
            <li><a href="#" className="hover:underline">Krikorian Gallery</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-playfair mb-2">Newsletter</h4>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="p-2 rounded text-teal"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="ml-2 bg-sand text-teal px-4 py-2 rounded font-playfair"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          {status === 'success' && (
            <div className="text-green-200 mt-2" aria-live="polite">Thank you for subscribing!</div>
          )}
          {status === 'error' && (
            <div className="text-red-200 mt-2" aria-live="polite">Please enter a valid email.</div>
          )}
        </div>
      </div>
      <div className="text-center mt-8 text-sm">
        © 2025 Handcrafted Shop &middot; Powered by Next.js
      </div>
    </footer>
  );
}