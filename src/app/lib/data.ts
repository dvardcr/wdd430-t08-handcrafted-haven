import postgres from 'postgres';
import { Comment } from '@/app/lib/definitions';

export const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function updateArtisanPassword(email: string, password: string) {
	return await sql`
	UPDATE artisans
	SET password = ${password}
	WHERE email = ${email}
	RETURNING *;
	`;
}

export async function fetchProducts() {
	return await sql`
    SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.image_url, 
        p.price, 
        p.category, 
        a.name as artist
    FROM products p
    JOIN artisans a ON p.artisan_id = a.id
`;
}

export async function getProductById(id: string) {
	const result = await sql`
		SELECT 
			p.id,
			p.name,
			p.description,
			p.price,
			p.category,
			p.image_url,
			a.name AS artist
		FROM products p
		JOIN artisans a ON p.artisan_id = a.id
		WHERE p.id = ${id}
	`;

	return result[0];
}

export async function getCommentsByProductId(productId: string): Promise<Comment[]> {
	const rows = await sql`
		SELECT 
			r.id, 
			u.username, 
			r.comment, 
			r.rating, 
			r.created_at
		FROM reviews r
		JOIN users u ON r.user_id = u.id
		WHERE r.product_id = ${productId}
		ORDER BY r.created_at DESC
	`;

	return rows.map((row) => ({
		id: row.id as string,
		username: row.username as string,
		comment: row.comment as string,
		rating: row.rating as number,
		created_at: new Date(row.created_at),
	}));
}