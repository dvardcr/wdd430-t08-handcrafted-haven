"use client";

import Link from "next/link";
import Image from "next/image";
import {useSearchParams} from "next/navigation";
import {Product} from "@/app/lib/definitions";
import styles from "@/app/style.module.css";

export default function ProductsList({products}: {products: Product[]}) {
	const searchParams = useSearchParams();
	const query = searchParams.get("query")?.toLowerCase() || "";

	const filteredProducts = products.filter((product) =>
		[
			product.name,
			product.artist,
			product.category,
			product.price.toString(),
		].some((val) => val.toLowerCase().includes(query))
	);

	return (
		<div className={styles.productPage}
		>
			
			{filteredProducts.map((product) => (
				<Link key={product.id} href={`/products/${product.id}`}>
					<div className={styles.productCard}
					>
						<Image
							src={product.imageUrl}
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
							<strong>Type:</strong> {product.category}
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
	);
}
