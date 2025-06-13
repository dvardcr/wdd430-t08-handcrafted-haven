'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import styles from './edit.module.css';
import type { Artisan } from '@/lib/mockData';

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
}

export default function EditArtisanPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showProductDeleteConfirm, setShowProductDeleteConfirm] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      // Check if the authenticated user is the owner of this artisan profile
      const artisanId = session.user.artisanId;
      if (artisanId !== parseInt(params.id)) {
        router.push('/artisans');
        return;
      }

      // Fetch artisan data
      const fetchArtisan = async () => {
        try {
          const response = await fetch(`/api/artisans/${params.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch artisan data');
          }
          const data = await response.json();
          setArtisan(data);
        } catch (error) {
          console.error('Failed to fetch artisan:', error);
          setError('Failed to load artisan data');
        } finally {
          setIsLoading(false);
        }
      };

      fetchArtisan();
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [params.id, status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artisan) return;
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/artisans/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artisan),
      });

      if (!response.ok) {
        throw new Error('Failed to update artisan data');
      }

      setSuccess('Profile updated successfully');
      setTimeout(() => {
        router.push('/artisans');
      }, 1500);
    } catch (error) {
      console.error('Failed to update artisan:', error);
      setError('Failed to update artisan data');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, productId?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError(null);
    setSuccess(null);
    setIsUploading(true);

    try {
      // In a real application, you would upload the file to a storage service
      // and get back a URL. For now, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);

      if (productId) {
        // Update product image
        const updatedProducts = artisan?.products.map(p =>
          p.id === productId ? { ...p, imageUrl } : p
        );
        if (artisan && updatedProducts) {
          setArtisan({ ...artisan, products: updatedProducts });
        }
      } else {
        // Update profile image
        if (artisan) {
          setArtisan({ ...artisan, imageUrl });
        }
      }

      setSuccess('Image uploaded successfully');
    } catch (error) {
      console.error('Failed to upload image:', error);
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!artisan) return;
    setError(null);
    setSuccess(null);
    setIsDeleting(true);

    try {
      const updatedProducts = artisan.products.filter(p => p.id !== productId);
      const response = await fetch(`/api/artisans/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...artisan, products: updatedProducts }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setArtisan({ ...artisan, products: updatedProducts });
      setSuccess('Product deleted successfully');
      setShowProductDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
      setError('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!artisan) return;
    setError(null);
    setSuccess(null);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/artisans/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      setSuccess('Account deleted successfully');
      setTimeout(async () => {
        await signOut({ redirect: false });
        router.push('/');
      }, 1500);
    } catch (error) {
      console.error('Failed to delete account:', error);
      setError('Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>;
  }

  if (!artisan) {
    return <div>Artisan not found</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Edit Profile</h1>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
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
            onChange={(e) => handleImageUpload(e)}
            disabled={isUploading}
            className={styles.fileInput}
          />
          {isUploading && <div className={styles.uploading}>Uploading...</div>}
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
                onChange={(e) => handleImageUpload(e, product.id)}
                disabled={isUploading}
                className={styles.fileInput}
              />
              {isUploading && <div className={styles.uploading}>Uploading...</div>}
              <button
                type="button"
                onClick={() => setShowProductDeleteConfirm(product.id)}
                className={styles.deleteButton}
                disabled={isDeleting}
              >
                Delete Product
              </button>
            </div>
          ))}
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveButton} disabled={isDeleting}>
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push('/artisans')}
            className={styles.cancelButton}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className={styles.deleteAccountButton}
            disabled={isDeleting}
          >
            Delete Account
          </button>
        </div>
      </form>

      {showDeleteConfirm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Delete Account</h2>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className={styles.modalButtons}>
              <button
                onClick={handleDeleteAccount}
                className={styles.deleteAccountButton}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Account'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={styles.cancelButton}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showProductDeleteConfirm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Delete Product</h2>
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className={styles.modalButtons}>
              <button
                onClick={() => handleDeleteProduct(showProductDeleteConfirm)}
                className={styles.deleteButton}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Product'}
              </button>
              <button
                onClick={() => setShowProductDeleteConfirm(null)}
                className={styles.cancelButton}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 