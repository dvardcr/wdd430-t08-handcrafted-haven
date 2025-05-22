import Link from 'next/link';

const categories = [
  { name: "Ceramics Under $50", href: "/ceramics?price=under-50" },
  { name: "Jewelry under $50", href: "/jewelry?price=under-50" },
];

export default function CategoryGrid() {
  return (
    <section className="py-8 bg-sand">
      <h3 className="text-2xl font-playfair text-center text-teal mb-6">Shop For</h3>
      <div className="flex justify-center gap-8">
        {categories.map(cat => (
          <Link key={cat.name} href={cat.href} className="bg-white px-6 py-4 rounded shadow font-playfair text-lg hover:bg-teal hover:text-white transition">
            {cat.name}
          </Link>
        ))}
      </div>
    </section>
  );
} 