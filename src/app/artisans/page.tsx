'use client';

import Image from "next/image";
import styles from "./artisans.module.css";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { mockArtisans, type Artisan } from '@/lib/mockData';

export default function ArtisansPage() {
  const { data: session, status } = useSession();
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        // In a real application, this would be an API call
        setArtisans(mockArtisans);
      } catch (error) {
        console.error('Failed to fetch artisans:', error);
        setError('Failed to load artisans');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtisans();
  }, []);

  if (status === 'loading' || isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Our Artisans</h1>
        <p>Meet the talented craftspeople behind our handmade products</p>
      </header>

      <div className={styles.grid}>
        {artisans.map((artisan) => (
          <article key={artisan.id} className={styles.artisanCard}>
            <div className={styles.imageWrapper}>
              <Image
                src={artisan.imageUrl}
                alt={artisan.name}
                width={300}
                height={300}
                className={styles.artisanImage}
              />
            </div>
            <div className={styles.artisanInfo}>
              <h2>{artisan.name}</h2>
              <p className={styles.specialty}>{artisan.specialty}</p>
              <p className={styles.location}>{artisan.location}</p>
              <p className={styles.bio}>{artisan.bio}</p>
              {session?.user.artisanId === artisan.id && (
                <Link 
                  href={`/artisans/edit/${artisan.id}`}
                  className={styles.editButton}
                >
                  Edit Profile
                </Link>
              )}
            </div>
            <div className={styles.products}>
              <h3>Featured Works</h3>
              <div className={styles.productGrid}>
                {artisan.products.map((product) => (
                  <div key={product.id} className={styles.productCard}>
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={150}
                      height={150}
                      className={styles.productImage}
                    />
                    <p className={styles.productName}>{product.name}</p>
                    <p className={styles.productPrice}>${product.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
} 