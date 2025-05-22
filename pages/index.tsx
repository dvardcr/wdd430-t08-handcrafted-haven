import Head from 'next/head';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import CategoryGrid from '../components/CategoryGrid';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Handcrafted Shop</title>
        <meta name="description" content="Handcrafted Shop - Unique, artisan goods for every occasion." />
      </Head>
      <Header />
      <main>
        <HeroBanner />
        <CategoryGrid />
      </main>
      <Footer />
    </>
  );
} 