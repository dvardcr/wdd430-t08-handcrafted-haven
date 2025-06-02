import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { artisans, products, reviews, users } from '../../lib/placeholder-data';

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
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING
        RETURNING *;
      `;
    }),
  );

  return insertedUsers.map(r => r[0]);
}

async function seedArtisans() {
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
    artisans.map(
      (artisan: any) => sql`
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
      `
    )
  );

  return insertedArtisans.map(r => r[0]);
}

async function seedProducts(insertedArtisans) {
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

  // Map your products and assign artisan_id dynamically:
  const productsWithArtisanId = products.map((product, i) => ({
    ...product,
    artisan_id: insertedArtisans[i % insertedArtisans.length].id, // simple round-robin assign
  }));

  const insertedProducts = await Promise.all(
    productsWithArtisanId.map(product =>
      sql`
        INSERT INTO products (
          artisan_id, name, description, category, price,
          images, stock_quantity
        )
        VALUES (
          ${product.artisan_id}, ${product.name}, ${product.description}, ${sql.array(product.category)},
          ${product.price}, ${sql.array(product.images)},
          ${product.stock_quantity}
        )
        RETURNING *;
      `
    )
  );

  return insertedProducts.map(r => r[0]);
}

async function seedReviews(insertedProducts) {
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

  // Assign real product_ids dynamically (simple round-robin)
  const reviewsWithProductId = reviews.map((review, i) => ({
    ...review,
    product_id: insertedProducts[i % insertedProducts.length].id,
  }));

  const insertedReviews = await Promise.all(
    reviewsWithProductId.map(review =>
      sql`
        INSERT INTO reviews (
          product_id, user_id, rating, comment
        )
        VALUES (
          ${review.product_id}, ${review.user_id}, ${review.rating}, ${review.comment}
        )
        RETURNING *;
      `
    )
  );

  return insertedReviews.map(r => r[0]);
}

export async function GET() {
  try {
    await sql.begin(async (sql) => {
      const artisansSeeded = await seedArtisans();
      const productsSeeded = await seedProducts(artisansSeeded);
      await seedReviews(productsSeeded);
      await seedUsers();
    });

    return new Response(JSON.stringify({ message: 'Database seeded successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
