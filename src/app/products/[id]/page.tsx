"use client";

import Link from "next/link";
import {useState} from "react";
import {Product, Comment} from "@/lib/definitions";
import Image from "next/image";
import {useParams} from "next/navigation";
// import { notFound } from "next/navigation";

// Temporary dummy data for products - Need to connect DB
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

export default function ProductDetailsPage() {
	const params = useParams();
	const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

	// TODO: Replace dummy product data with real data fetched from database (SQL via Vercel)
	const product = products.find((p) => p.id === id);

	// Comments state, can add/edit/delete later
	// TODO: Replace with fetching comments for this product from backend API
	const [comments, setComments] = useState<Comment[]>([]);

	// Form State
	const [username, setUsername] = useState("");
	const [commentText, setCommentText] = useState("");
	const [rating, setRating] = useState(5);
	const [editingId, setEditingId] = useState<number | null>(null);

	// If product not found, show the not-found page
	// if (!product) notFound();
	if (!product) {
		return (
			<main>
				<h1>Product Not Found</h1>
				<p>Sorry, we couldn’t find the product you were looking for.</p>
				<Link
					href='/products'
					style={{color: "blue", textDecoration: "underline"}}
				>
					← Back to Products
				</Link>
			</main>
		);
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!username.trim() || !commentText.trim()) return;

		if (editingId) {
			// TODO: Replace local state update with API call to update comment in database
			setComments(
				comments.map((comment) =>
					comment.id === editingId
						? {...comment, username, text: commentText, rating}
						: comment
				)
			);
			setEditingId(null);
		} else {
			// TODO: Replace local state update with API call to add new comment in database
			const newComment = {
				id: Date.now(),
				username,
				text: commentText,
				rating,
			};
			setComments([newComment, ...comments]);
		}

		// Reset form
		setUsername("");
		setCommentText("");
		setRating(5);
	};

	const handleEdit = (id: number) => {
		const comment = comments.find((c) => c.id === id);
		if (!comment) return;

		setUsername(comment.username);
		setCommentText(comment.text);
		setRating(comment.rating);
		setEditingId(id);
	};

	const handleDelete = (id: number) => {
		// TODO: Replace local state update with API call to delete comment from database
		setComments(comments.filter((c) => c.id !== id));
	};

	return (
		<main>
			<Link
				href='/products'
				style={{
					color: "blue",
					textDecoration: "underline",
					marginBottom: "1rem",
					display: "inline-block",
				}}
			>
				← Back to Products
			</Link>
			<h1>{product.name}</h1>
			<Image
				src={product.image}
				alt={product.name}
				width={300}
				height={300}
				style={{objectFit: "cover"}}
			/>
			<p>
				<strong>Price:</strong> ${product.price}
			</p>
			<p>
				<strong>Description:</strong> {product.description}
			</p>
			<p>
				<strong>Artist:</strong> {product.artist}
			</p>
			<p>
				<strong>Type:</strong> {product.type}
			</p>

			<hr />

			<h2>{editingId ? "Edit Comment" : "Leave a Comment"}</h2>
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					placeholder='Your name'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					style={{display: "block", width: "100%", marginBottom: "8px"}}
				/>
				<textarea
					placeholder='Write your comment'
					value={commentText}
					onChange={(e) => setCommentText(e.target.value)}
					rows={3}
					style={{display: "block", width: "100%", marginBottom: "8px"}}
				/>
				<label>
					Rating:
					<select
						value={rating}
						onChange={(e) => setRating(Number(e.target.value))}
					>
						{[1, 2, 3, 4, 5].map((r) => (
							<option key={r} value={r}>
								{r}
							</option>
						))}
					</select>
				</label>
				<br />
				<button type='submit'>
					{editingId ? "Update Comment" : "Submit Comment"}
				</button>
			</form>

			<hr />

			<h2>Comments</h2>
			{comments.length === 0 ? (
				<p>No comments yet.</p>
			) : (
				<ul>
					{comments.map((c) => (
						<li key={c.id}>
							<strong>{c.username}</strong> – Rating: {c.rating} <br />
							{c.text} <br />
							<button onClick={() => handleEdit(c.id)}>Edit</button>
							<button
								onClick={() => handleDelete(c.id)}
								style={{marginLeft: "8px"}}
							>
								Delete
							</button>
						</li>
					))}
				</ul>
			)}
		</main>
	);
}
