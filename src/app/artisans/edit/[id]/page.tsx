'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './edit.module.css';

type Product = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
};

type Artisan = {
  id: number;
  name: string;
  specialty: string;
  bio: string;
  imageUrl: string;
  location: string;
  products: Product[];
};

export default function EditArtisanPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        // Replace with your actual authentication check
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch artisan data
      const fetchArtisan = async () => {
        try {
          // Replace with your actual API call
          const response = await fetch(`/api/artisans/${params.id}`);
          const data = await response.json();
          setArtisan(data);
        } catch (error) {
          console.error('Failed to fetch artisan:', error);
        }
      };

      fetchArtisan();
    }
  }, [params.id, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artisan) return;

    try {
      // Replace with your actual API call
      await fetch(`/api/artisans/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artisan),
      });

      router.push('/artisans');
    } catch (error) {
      console.error('Failed to update artisan:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.authContainer}>
        <h2>Authentication Required</h2>
        <p>Please log in to edit your profile.</p>
        <button onClick={() => router.push('/login')}>Log In</button>
      </div>
    );
  }

  if (!artisan) {
    return <div>Artisan not found</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.imageSection}>
          <Image
            src={artisan.imageUrl}
            alt={artisan.name}
            width={300}
            height={300}
            className={styles.artisanImage}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              // Handle image upload
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={artisan.name}
            onChange={(e) => setArtisan({ ...artisan, name: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="specialty">Specialty</label>
          <input
            type="text"
            id="specialty"
            value={artisan.specialty}
            onChange={(e) => setArtisan({ ...artisan, specialty: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={artisan.location}
            onChange={(e) => setArtisan({ ...artisan, location: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={artisan.bio}
            onChange={(e) => setArtisan({ ...artisan, bio: e.target.value })}
            rows={4}
          />
        </div>

        <div className={styles.productsSection}>
          <h2>Products</h2>
          {artisan.products.map((product: Product) => (
            <div key={product.id} className={styles.productCard}>
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={150}
                height={150}
                className={styles.productImage}
              />
              <input
                type="text"
                value={product.name}
                onChange={(e) => {
                  const updatedProducts = artisan.products.map((p: Product) =>
                    p.id === product.id ? { ...p, name: e.target.value } : p
                  );
                  setArtisan({ ...artisan, products: updatedProducts });
                }}
              />
              <input
                type="number"
                value={product.price}
                onChange={(e) => {
                  const updatedProducts = artisan.products.map((p: Product) =>
                    p.id === product.id ? { ...p, price: Number(e.target.value) } : p
                  );
                  setArtisan({ ...artisan, products: updatedProducts });
                }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  // Handle product image upload
                }}
              />
            </div>
          ))}
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveButton}>
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push('/artisans')}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 