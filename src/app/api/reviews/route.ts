import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/data';

function validateReview(data: unknown): data is {
	product_id: string;
	username: string;
	comment: string;
	rating: number;
} {
	if (
		!data ||
		typeof data !== 'object' ||
		!('product_id' in data) ||
		!('username' in data) ||
		!('comment' in data) ||
		!('rating' in data)
	) {
		return false;
	}

	const { product_id, username, comment, rating } = data as {
		product_id: unknown;
		username: unknown;
		comment: unknown;
		rating: unknown;
	};

	return (
		typeof product_id === 'string' &&
		product_id.length === 36 &&
		typeof username === 'string' &&
		username.length === 36 &&
		typeof comment === 'string' &&
		comment.trim().length >= 2 &&
		typeof rating === 'number' &&
		Number.isInteger(rating) &&
		rating >= 1 &&
		rating <= 5
	);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!validateReview(body)) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { product_id, username, comment, rating } = body;

        const [newReview] = await sql`
        INSERT INTO reviews (product_id, username, comment, rating)
        VALUES (${product_id}, ${username.trim()}, ${comment.trim()}, ${rating})
        RETURNING id, username, comment, rating, created_at
        `;

        return NextResponse.json(newReview, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof Error) {
        console.error('POST /api/reviews error:', error.message);
        } else {
        console.error('POST /api/reviews unknown error:', error);
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}