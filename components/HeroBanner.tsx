import Image from 'next/image';

export default function HeroBanner() {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
      {/* Hero Image */}
      <Image
        src="/hero.jpg" // Place your image in /public/hero.jpg or change the path
        alt="Handcrafted goods"
        fill
        className="object-cover"
        priority
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      {/* Text and CTA */}
      <div className="relative z-10 text-center text-white flex flex-col items-center justify-center w-full">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4 drop-shadow-lg">
          Discover Unique, Handcrafted Goods
        </h1>
        <p className="text-lg md:text-xl font-lato italic mb-6 max-w-xl drop-shadow">
          Shop artisan ceramics, jewelry, and more—crafted with care for every occasion.
        </p>
        <a
          href="/ceramics"
          className="bg-sand text-teal font-bold px-6 py-3 rounded shadow hover:bg-teal hover:text-sand transition"
        >
          Shop Ceramics
        </a>
      </div>
    </section>
  );
} 