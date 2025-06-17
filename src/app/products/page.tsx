import { fetchProducts } from "@/app/lib/data";
import Search from "@/app/ui/products/search";
import ProductsList from "@/app/ui/products/product-list";
import { Suspense } from "react";
import { Product, ProductSecond } from "@/app/lib/definitions";
import styles from "@/app/style.module.css";

export default async function ProductsGalleryPage() {
	const rows = await fetchProducts();

	const products: ProductSecond[] = rows.map(row => ({
		id: row.id,
		name: row.name,
		description: row.description,
		imageUrl: row.image_url,
		price: Number(row.price),
		category: row.category,
		artist: row.artist,
	}));

	return (
		<main>
			<h1 className={styles.title}>Handcrafted Haven</h1>
			<h1>All Products</h1>

			<Suspense fallback={<div>Loading products...</div>}>
				<Search placeholder='Search by name, type, artist, or price' />
				<ProductsList products={products} />
			</Suspense>
		</main>
	);
}
