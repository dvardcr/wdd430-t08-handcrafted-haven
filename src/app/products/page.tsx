import {fetchProducts} from "@/app/lib/data";
import Search from "@/app/ui/products/search";
import ProductsList from "@/app/ui/products/product-list";
import {Suspense} from "react";
import {Product} from "@/app/lib/definitions";

export default async function ProductsGalleryPage() {
	const rows = await fetchProducts();

	const products: Product[] = rows.map(row => ({
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
			<h1>All Products</h1>
			
			<Suspense fallback={<div>Loading products...</div>}>
				<Search placeholder='Search by name, type, artist, or price' />
				<ProductsList products={products} />
			</Suspense>
		</main>
	);
}
