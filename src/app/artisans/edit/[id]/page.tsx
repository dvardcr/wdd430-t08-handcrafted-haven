"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {useSession} from "next-auth/react";
import styles from "./edit.module.css";
import type {Artisan} from "@/lib/mockData";

interface Product {
	id: number;
	name: string;
	imageUrl: string;
	price: number;
}

export default function EditArtisanPage({params}: {params: {id: string}}) {
	const router = useRouter();
	const {data: session, status} = useSession();
	const [artisan, setArtisan] = useState<Artisan | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [password, setPassword] = useState<string>("");
	const [newPassword, setNewPassword] = useState<string>("");
	const [passwordMatch, setPasswordMatch] = useState<boolean>(false);

	useEffect(() => {
		if (status === "authenticated") {
			// Check if the authenticated user is the owner of this artisan profile
			const artisanId = session.user.artisanId;
			if (artisanId !== parseInt(params.id)) {
				router.push("/artisans");
				return;
			}

			// Fetch artisan data
			const fetchArtisan = async () => {
				try {
					const response = await fetch(`/api/artisans/${params.id}`);
					if (!response.ok) {
						throw new Error("Failed to fetch artisan data");
					}
					const data = await response.json();
					setArtisan(data);
				} catch (error) {
					console.error("Failed to fetch artisan:", error);
					setError("Failed to load artisan data");
				} finally {
					setIsLoading(false);
				}
			};

			fetchArtisan();
		} else if (status === "unauthenticated") {
			router.push("/login");
		}
	}, [params.id, status, session, router]);

	useEffect(() => {
		if (Boolean(String(newPassword)) && password === newPassword) {
			console.log("match!");
			setPasswordMatch(true);
		} else {
			setPasswordMatch(false);
		}
	}, [password, newPassword]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!artisan) return;

		try {
			const response = await fetch(`/api/artisans/${params.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(artisan),
			});

			if (!response.ok) {
				throw new Error("Failed to update artisan data");
			}

			router.push("/artisans");
		} catch (error) {
			console.error("Failed to update artisan:", error);
			setError("Failed to update artisan data");
		}
	};

	const handleImageUpload = () => {
		// Implement image upload functionality
	};

	const handlePasswordSubmit = async (e: React.FormEvent) => {
		try {
			const response = await fetch(`/api/artisans/${session?.user.artisanId}`, {
				method: "PUT",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					action: "update_password",
					newPassword: newPassword,
					email: session?.user.email,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to change password.");
			}

			setPassword("");
			setNewPassword("");
		} catch (error: any) {
			console.error("Failed to update password:", error);
			setError(error.message);
		}
	};

	if (status === "loading" || isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div className={styles.error}>{error}</div>;
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
					<input type='file' accept='image/*' onChange={handleImageUpload} />
				</div>

				<hr></hr>
				<h3 className='text-center'>Need an update on your password?</h3>
				<div className={styles.formGroup}>
					<label htmlFor='password-change'>New Password</label>
					<input
						name='password-change'
						type='text'
						onChange={(e) => setPassword(e.target.value)}
					/>
					<label htmlFor='password-change'>Confirm New Password</label>
					<input
						name='password-change'
						type='text'
						onChange={(e) => setNewPassword(e.target.value)}
					/>
					<button
						type='button'
						onClick={handlePasswordSubmit}
						className={styles.saveButton}
						disabled={!passwordMatch}
					>
						Change Password
					</button>
				</div>

				<hr></hr>
				<h3 className='text-center'>Need an update on your data?</h3>
				<div className={styles.formGroup}>
					<label htmlFor='name'>Name</label>
					<input
						type='text'
						id='name'
						value={artisan.name}
						onChange={(e) => setArtisan({...artisan, name: e.target.value})}
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor='specialty'>Specialty</label>
					<input
						type='text'
						id='specialty'
						value={artisan.specialty}
						onChange={(e) =>
							setArtisan({...artisan, specialty: e.target.value})
						}
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor='location'>Location</label>
					<input
						type='text'
						id='location'
						value={artisan.location}
						onChange={(e) => setArtisan({...artisan, location: e.target.value})}
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor='bio'>Bio</label>
					<textarea
						id='bio'
						value={artisan.bio}
						onChange={(e) => setArtisan({...artisan, bio: e.target.value})}
						rows={4}
					/>
				</div>

				<div className={styles.productsSection}>
					<h2>Products</h2>

					<button
						type='button'
						className={styles.submitButton}
						onClick={() => router.push("/add-product")}
					>
						+ Add Product
					</button>

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
								type='text'
								value={product.name}
								onChange={(e) => {
									const updatedProducts = artisan.products.map((p: Product) =>
										p.id === product.id ? {...p, name: e.target.value} : p
									);
									setArtisan({...artisan, products: updatedProducts});
								}}
							/>
							<input
								type='number'
								value={product.price}
								onChange={(e) => {
									const updatedProducts = artisan.products.map((p: Product) =>
										p.id === product.id
											? {...p, price: Number(e.target.value)}
											: p
									);
									setArtisan({...artisan, products: updatedProducts});
								}}
							/>
							<input
								type='file'
								accept='image/*'
								onChange={handleImageUpload}
							/>
						</div>
					))}
				</div>

				<div className={styles.buttonGroup}>
					<button type='submit' className={styles.saveButton}>
						Save Changes
					</button>
					<button
						type='button'
						onClick={() => router.push("/artisans")}
						className={styles.cancelButton}
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
