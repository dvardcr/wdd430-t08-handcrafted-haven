"use client";

import Link from "next/link";
import Image from "next/image";
import {products} from "@/app/lib/placeholder-data";
import Search from "@/app/ui/products/search";
import {useSearchParams} from "next/navigation";

export default function ProductsGalleryPage() {
	const searchParams = useSearchParams();
	const query = searchParams.get("query")?.toLowerCase() || "";

	const filteredProducts = products.filter((product) => {
		return (
			product.name.toLowerCase().includes(query) ||
			product.artist.toLowerCase().includes(query) ||
			product.type.toLowerCase().includes(query) ||
			product.price.toString().includes(query)
		);
	});

	return (
		<main>
			<h1>All Products</h1>

			{/* Use the unified Search component */}
			<Search placeholder='Search by name, type, artist, or price' />

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
					gap: "1.5rem",
					marginTop: "1.5rem",
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

				{filteredProducts.length === 0 && (
					<p style={{gridColumn: "1 / -1"}}>No products found.</p>
				)}
			</div>
		</main>
	);
}
