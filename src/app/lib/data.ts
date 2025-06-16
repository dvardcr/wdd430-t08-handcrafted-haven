import postgres from 'postgres';
import { Comment, Artisan } from '@/app/lib/definitions';

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

export async function getArtisanEmailByEmail(email: string) {
	const result = await sql`
		SELECT 
			a.email
		FROM artisans a
		WHERE a.email = ${email}
	`;

	return result[0];
}

export async function getArtisanByEmail(email: string): Promise<Artisan | undefined> {
	try {
		const result = await sql<Artisan[]>`
		SELECT *, artisan_id as "artisanId" FROM artisans WHERE email = ${email}
	  `;
		return result[0];
	} catch (error) {
		console.error('Failed to fetch artisan:', error);
		throw new Error('Failed to fetch artisan.');
	}
}

export async function countArtisans() {

	const result = await sql`
	SELECT 
		COUNT(*) AS count
	FROM artisans
	`;

	return Number(result[0].count);
}

export async function getCommentsByProductId(productId: string): Promise<Comment[]> {
	const rows = await sql`
		SELECT id, username, comment, rating, created_at
		FROM reviews
		WHERE product_id = ${productId}
		ORDER BY created_at DESC
	`;

	return rows.map((row) => ({
		id: row.id as string,
		username: row.username as string,
		comment: row.comment as string,
		rating: row.rating as number,
		created_at: new Date(row.created_at),
	}));
}



export type NewArtisanData = Omit<Artisan, 'id' | 'artisanId'>; // id is generated on db given uuid_generate_v4()
export async function createArtisan(artisan: NewArtisanData) {
	const { name, email, password, specialty, bio, imageUrl, location } = artisan;

	const result = await sql`
	  INSERT INTO artisans (name, email, password, specialty, bio, image_url, location)
	  VALUES (${name}, ${email}, ${password}, ${specialty}, ${bio}, ${imageUrl}, ${location})
	  RETURNING id, name, email;
	`;

	// Return the newly created artisan
	return result[0];
}