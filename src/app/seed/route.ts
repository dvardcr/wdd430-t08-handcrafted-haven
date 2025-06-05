import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { artisans, products, reviews, users } from '../../lib/placeholder-data';
import { Artisan } from '../../lib/utils';
import { NextRequest } from 'next/server';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const result = await sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING
        RETURNING *;
      `;
      return result[0];
    })
  );

  return insertedUsers;
}

async function dropUsersTableIfExists() {
  await sql`DROP TABLE IF EXISTS users CASCADE;`;
}

async function seedArtisans(): Promise<Artisan[]> {
  await sql`
    CREATE TABLE IF NOT EXISTS artisans (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      profile_image_url TEXT,
      location VARCHAR(255),
      bio TEXT,
      story TEXT,
      skills TEXT[],
      twitter_link TEXT,
      portfolio_images TEXT[],
      joined_at TIMESTAMP DEFAULT NOW(),
      is_active BOOLEAN DEFAULT TRUE,
      contact_email VARCHAR(255)
    );
  `;

  const insertedArtisans = await Promise.all(
    artisans.map(async (artisan) => {
      const result = await sql`
        INSERT INTO artisans (
          name, profile_image_url, location, bio, story, skills,
          twitter_link, portfolio_images, contact_email
        )
        VALUES (
          ${artisan.name}, ${artisan.profile_image_url}, ${artisan.location},
          ${artisan.bio}, ${artisan.story}, ${sql.array(artisan.skills)},
          ${artisan.twitter_link}, ${sql.array(artisan.portfolio_images)},
          ${artisan.contact_email}
        )
        RETURNING *;
      `;
      return result[0];
    })
  );

  return insertedArtisans as Artisan[];
}

async function seedProducts(insertedArtisans: Artisan[]) {
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      artisan_id UUID REFERENCES artisans(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      category TEXT[],
      price DECIMAL(10, 2) NOT NULL,
      images TEXT[],
      stock_quantity INT DEFAULT 0,
      rating_avg FLOAT DEFAULT 0.0,
      num_reviews INT DEFAULT 0,
      ratings INT[],
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  const productsWithArtisanId = products.map((product, i) => ({
    ...product,
    artisan_id: insertedArtisans[i % insertedArtisans.length].id,
  }));

  const insertedProducts = await Promise.all(
    productsWithArtisanId.map(async (product) => {
      const result = await sql`
        INSERT INTO products (
          artisan_id, name, description, category, price,
          images, stock_quantity
        )
        VALUES (
          ${product.artisan_id}, ${product.name}, ${product.description}, ${sql.array(product.category)},
          ${product.price}, ${sql.array(product.images)}, ${product.stock_quantity}
        )
        RETURNING *;
      `;
      return result[0];
    })
  );

  return insertedProducts.map(r => r[0] as { id: string });

}

async function seedReviews(insertedProducts: { id: string }[]) {
  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      product_id UUID REFERENCES products(id) ON DELETE CASCADE,
      user_id UUID NULL,
      rating INT CHECK (rating >= 1 AND rating <= 5),
      comment TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  const reviewsWithProductId = reviews.map((review, i) => ({
    ...review,
    product_id: insertedProducts[i % insertedProducts.length].id,
  }));

  const insertedReviews = await Promise.all(
    reviewsWithProductId.map(async (review) => {
      const result = await sql`
        INSERT INTO reviews (
          product_id, user_id, rating, comment
        )
        VALUES (
          ${review.product_id}, ${review.user_id}, ${review.rating}, ${review.comment}
        )
        RETURNING *;
      `;
      return result[0];
    })
  );

  return insertedReviews;
}

async function modifyReviewsSchema() {
  await sql`
    ALTER TABLE reviews
    ADD COLUMN IF NOT EXISTS name TEXT;
  `;

  await sql`
    ALTER TABLE reviews
    DROP COLUMN IF EXISTS user_id;
  `
}

async function modifyArtisansSchema() {
  sql`
    ADD COLUMN IF NOT EXISTS password TEXT NOT NULL;  
  `
}

export async function GET(request: NextRequest) {
  try {

    // this will require the URL `http://localhost:3000/seed?fix=true` to be called once. to 
    const searchParams = request.nextUrl.searchParams;
    const fixIssues = searchParams.get('fix');

    // add functions to:
    /**
      1) Remove the Users table, 
      2) keep the user name in the reviews table, 
      3) remove User Id from the reviews table, and 
      4) add the password column to the Artisans table?
     */

    if (Boolean(fixIssues)) {
      await dropUsersTableIfExists(); // 2)
      await modifyReviewsSchema(); // 2) & 3)
      await modifyArtisansSchema(); // 4)

    }

    if (!Boolean(fixIssues) || fixIssues == undefined) {
      await sql.begin(async () => {
        const artisansSeeded = await seedArtisans();
        const productsSeeded = await seedProducts(artisansSeeded);
        await seedReviews(productsSeeded);
        await seedUsers();
      });
    }

    return new Response(JSON.stringify({ message: 'Database seeded successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Seed error:', error);
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
