import {getProductById, getCommentsByProductId} from "@/app/lib/data";
import {notFound} from "next/navigation";
import {Comment} from "@/app/lib/definitions";
import ReviewForm from "@/app/ui/reviews/review-form";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/style.module.css";

export default async function ProductDetailsPage(props: {
	params: Promise<{id: string}>;
}) {
	const params = await props.params;
	const id = params.id;

	const product = await getProductById(id);
	if (!product) return notFound();

	const comments: Comment[] = await getCommentsByProductId(id);

	return (
		<main>
			<h1 className={styles.title}>Handcrafted Haven</h1>
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

			<div className={styles.productDetailsCard}>
			<h1 className={styles.productHead}>{product.name}</h1>
			<Image
				src={product.image_url}
				alt={product.name}
				width={300}
				height={300}
			/>
			<p className={styles.productDetailsChild}>
				<strong>Price:</strong> ${product.price}
			</p>
			<p className={styles.productDetailsChild}>
				<strong>Artist:</strong> {product.artist}
			</p>
			<p className={styles.productDetailsChild}>
				<strong>Type:</strong> {product.category}
			</p>

			<hr />

			<h2 className={styles.productDetailsChild}><strong>Leave a Comment</strong></h2>
			<ReviewForm productId={product.id} existingComments={comments} />

			<hr />

			<h2 className={styles.productDetailsChild}>Comments</h2>
			{comments.length === 0 ? (
				<p className={styles.productDetailsChild}>No comments yet.</p>
			) : (
				<ul>
					{comments.map((c) => (
						<li key={c.id}>
							<strong>{c.username}</strong> – Rating: {c.rating}
							<br />
							{c.comment}
							<br />
							<small>{new Date(c.created_at).toLocaleDateString()}</small>
						</li>
					))}
				</ul>
			)}
			</div>
		</main>
	);
}
