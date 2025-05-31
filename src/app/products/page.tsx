"use client";

import Link from "next/link";
import {Product} from "@/lib/definitions";

// Dummy products data
const products: Product[] = [
	{
		id: "123",
		name: "Handwoven Basket",
		image: "https://via.placeholder.com/300",
		description: "A beautifully handwoven basket made from natural materials.",
		price: 25.99,
		artist: "Maria Lopez",
		type: "Home Decor",
	},
	{
		id: "456",
		name: "Ceramic Mug",
		image: "https://via.placeholder.com/300",
		description: "A handmade ceramic mug, perfect for your morning coffee.",
		price: 14.99,
		artist: "Jorge Ramirez",
		type: "Kitchenware",
	},
];

export default function ProductsPage() {
	return (
		<main>
			<h1>Products</h1>
			<ul style={{listStyle: "none", paddingLeft: 0}}>
				{products.map((product) => (
					<li key={product.id} style={{marginBottom: "1rem"}}>
						<Link
							href={`/products/${product.id}`}
							style={{color: "blue", textDecoration: "underline"}}
						>
							<strong>{product.name}</strong> — ${product.price}
						</Link>
						<p>{product.description}</p>
					</li>
				))}
			</ul>
		</main>
	);
}
