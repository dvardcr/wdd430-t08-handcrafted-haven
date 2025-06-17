'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/login/login.module.css';

export default function SignUpPage() {
    const router = useRouter();

    // --- CHANGED: Added state for all artisan fields ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');
    const [imageUrl, setImageUrl] = useState(''); // Optional, for simplicity we use a text input
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/artisans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    specialty,
                    bio,
                    imageUrl,
                    location,
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

    const handleLogInRedirect = () => {
        router.push('/login');
    }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1><strong>Create Your Artisan Profile</strong></h1>
                {error && <div className={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Full Name</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="specialty">Specialty (e.g., Ceramics, Woodworking)</label>
                        <input id="specialty" type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required disabled={isLoading} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="location">Location (e.g., Portland - OR, US)</label>
                        <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} required disabled={isLoading} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="bio">Bio</label>
                        <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} required disabled={isLoading} rows={4} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="imageUrl">Profile Image URL (Optional)</label>
                        <input id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} disabled={isLoading} placeholder="https://example.com/image.jpg" />
                    </div>

                    <hr style={{ margin: '20px 0' }} />

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="confirm">Confirm password</label>
                        <input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} />
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={isLoading}>
                        {isLoading ? 'Creating Profile...' : 'Sign Up'}
                    </button>
                </form>
                <hr style={{ marginTop: '30px' }}></hr>
                <div className={styles.formGroup}>
                    <p style={{ marginTop: '30px', marginBottom: '30px', fontSize: '12px' }}>Already an artisan?</p>
                    <button onClick={handleLogInRedirect}>
                        Log In
                    </button>
                </div>
            </div>
        </div>
    );
}