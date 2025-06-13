'use server';

import { sql } from './data';
import { Comment } from './definitions';

// Define a new type including user_id
export interface ReviewData {
	user_id: string;
	username: string;
	comment: string;
	rating: number;
}

// Add a new review
export async function addReview(
	productId: string,
	data: ReviewData
): Promise<Comment | null> {
	const result = await sql<Comment[]>`
		INSERT INTO reviews (product_id, user_id, username, comment, rating)
		VALUES (${productId}, ${data.user_id}, ${data.username}, ${data.comment}, ${data.rating})
		RETURNING id, product_id, user_id, username, comment, rating, created_at
	`;

	return result[0] || null;
}

// Update an existing review
export async function updateReview(
	id: string,
	data: ReviewData
): Promise<Comment | null> {
	const result = await sql<Comment[]>`
		UPDATE reviews
		SET user_id = ${data.user_id},
			username = ${data.username},
			comment = ${data.comment},
			rating = ${data.rating}
		WHERE id = ${id}
		RETURNING id, product_id, user_id, username, comment, rating, created_at
	`;

	return result[0] || null;
}

// Delete a review
export async function deleteReview(id: string): Promise<boolean> {
	const result = await sql`
		DELETE FROM reviews WHERE id = ${id}
	`;
	
	return result.count > 0;
}