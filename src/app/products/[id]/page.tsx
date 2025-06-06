import {getProductById, getCommentsByProductId} from "@/app/lib/data";
import {notFound} from "next/navigation";
import {Comment} from "@/app/lib/definitions";
import ReviewForm from "@/app/ui/reviews/review-form";
import Image from "next/image";
import Link from "next/link";

type PageParams = {
	id: string;
};

export default async function ProductDetailsPage({
	params,
}: {
	params: PageParams;
}) {
	const product = await getProductById(params.id);
	if (!product) return notFound();

	const comments: Comment[] = await getCommentsByProductId(params.id);

	return (
		<main>
			<Link
				href='/products'
				style={{
					textDecoration: "underline",
					marginBottom: "1rem",
					display: "inline-block",
				}}
			>
				← Back to Products
			</Link>

			<h1>{product.name}</h1>
			<Image
				src={product.image_url}
				alt={product.name}
				width={300}
				height={300}
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
				<strong>Type:</strong> {product.category}
			</p>

			<hr />

			<h2>Leave a Comment</h2>
			<ReviewForm productId={product.id} existingComments={comments} />

			<hr />

			<h2>Comments</h2>
			{comments.length === 0 ? (
				<p>No comments yet.</p>
			) : (
				<ul>
					{comments.map((c) => (
						<li key={c.id}>
							<strong>{c.username}</strong> – Rating: {c.rating} <br />
							{c.comment} <br />
							<small>{c.created_at.toLocaleDateString()}</small>
						</li>
					))}
				</ul>
			)}
		</main>
	);
}
