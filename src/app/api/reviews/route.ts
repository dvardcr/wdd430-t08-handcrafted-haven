import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/data';

function validateReview(data: unknown): data is {
    product_id: string;
    user_id: string;
    comment: string;
    rating: number;
} {
    if (
        !data ||
        typeof data !== 'object' ||
        !('product_id' in data) ||
        !('user_id' in data) ||
        !('comment' in data) ||
        !('rating' in data)
    ) {
    return false;
    }

    const { product_id, user_id, comment, rating } = data as {
        product_id: unknown;
        user_id: unknown;
        comment: unknown;
        rating: unknown;
    };

    return (
        typeof product_id === 'string' &&
        /^[0-9a-fA-F-]{36}$/.test(product_id) &&
        typeof user_id === 'string' &&
        /^[0-9a-fA-F-]{36}$/.test(user_id) &&
        typeof comment === 'string' &&
        comment.trim().length > 0 &&
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

    const { product_id, user_id, comment, rating } = body;

    const [newReview] = await sql`
        INSERT INTO reviews (product_id, user_id, comment, rating)
        VALUES (${product_id}, ${user_id}, ${comment.trim()}, ${rating})
        RETURNING id, user_id, comment, rating, created_at
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