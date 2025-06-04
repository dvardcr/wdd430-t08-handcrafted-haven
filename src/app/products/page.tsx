"use client";

import Link from "next/link";
import Image from "next/image";
import {useState} from "react";
import {products} from "@/lib/placeholder-data";

// Using temp CSS to build the products gallery page

export default function ProductsGalleryPage() {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredProducts = products.filter((product) => {
		const term = searchTerm.toLowerCase();
		return (
			product.name.toLowerCase().includes(term) ||
			product.artist.toLowerCase().includes(term) ||
			product.type.toLowerCase().includes(term) ||
			product.price.toString().includes(term)
		);
	});

	return (
		<main>
			<h1>All Products</h1>

			<input
				type='text'
				placeholder='Search by artist, type, or price'
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				style={{
					marginBottom: "1rem",
					padding: "0.5rem",
					width: "100%",
					maxWidth: "400px",
					display: "block",
				}}
			/>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
					gap: "1.5rem",
				}}
			>
				{filteredProducts.map((product) => (
					<Link key={product.id} href={`/products/${product.id}`}>
						<div
							style={{
								border: "1px solid #ccc",
								padding: "1rem",
								borderRadius: "8px",
							}}
						>
							<Image
								src={product.image}
								alt={product.name}
								width={300}
								height={200}
								style={{objectFit: "cover", width: "100%", height: "auto"}}
							/>
							<h2>{product.name}</h2>
							<p>
								<strong>Artist:</strong> {product.artist}
							</p>
							<p>
								<strong>Type:</strong> {product.type}
							</p>
							<p>
								<strong>Price:</strong> ${product.price.toFixed(2)}
							</p>
						</div>
					</Link>
				))}
			</div>
		</main>
	);
}
