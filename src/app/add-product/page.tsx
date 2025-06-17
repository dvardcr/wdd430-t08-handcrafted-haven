'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from '@/app/login/login.module.css';

export default function AddProductPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    // --- Added state for all product fields ---
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState(''); 

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        setIsLoading(true);

        try {
            const response = await fetch(`/api/artisans/${session?.user.artisanId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'add-product',
                    name: name,
                    description: description,
                    price: price,
                    category: category,
                    imageUrl: imageUrl,
                    artisanId: session?.user.artisanId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create profile.');
            }

            // On success, redirect to the login page
            router.push('/login');

        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // const handleEditRedirect = () => {
    //     router.push(`/edit/${}`);
    // }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1><strong>Add New Product</strong></h1>
                {error && <div className={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Product Name</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required disabled={isLoading} rows={4} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="price">Price</label>
                        <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required disabled={isLoading} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="category">Category</label>
                        <input id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required disabled={isLoading} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="imageUrl">Product Image URL (Optional)</label>
                        <input id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} disabled={isLoading} placeholder="https://example.com/image.jpg" />
                    </div>

                    <hr style={{ margin: '20px 0' }} />

                    

                    <button type="submit" className={styles.submitButton} disabled={isLoading}>
                        {isLoading ? 'Creating Product...' : 'Add New'}
                    </button>
                </form>
                <hr style={{ marginTop: '30px' }}></hr>
            </div>
        </div>
    );
}