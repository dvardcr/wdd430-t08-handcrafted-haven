// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
    {
        id: '410544b2-4001-4271-9855-fec4b6a6442a',
        name: 'User',
        email: 'user@nextmail.com',
        password: '123456',
    },
];

const reviews = [
    {
        product_id: null,
        user_id: null, // optional, can be replaced with a real user ID
        rating: 5,
        comment: 'Beautiful basket! Well-made and perfect for storage.',
    },
    {
        product_id: null,
        user_id: null,
        rating: 4,
        comment: 'Table looks amazing, but shipping took a week longer than expected.',
    },
    {
        product_id: null,
        user_id: null,
        rating: 5,
        comment: 'Craftsmanship is top-notch. Highly recommended!',
    }
];

const artisans = [
    {
        name: "Jane Doe",
        profile_image_url: "https://example.com/jane.jpg",
        location: "Nairobi, Kenya",
        bio: "Master basket weaver",
        story: "Jane learned weaving from her grandmother...",
        skills: ['baskets', 'weaving'],
        twitter_link: "https://twitter.com/janedoe",
        portfolio_images: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
        contact_email: "jane@example.com"
    }
];

const products = [
    {
        artisan_id: null,
        name: 'Handwoven Basket',
        description: 'A durable and stylish basket made from natural sisal.',
        category: ['basket'],
        price: 45.00,
        images: [
            'https://example.com/basket1.jpg',
            'https://example.com/basket2.jpg'
        ],
        stock_quantity: 10,
        availability_status: 'in_stock',
        tags: ['eco-friendly', 'handmade']
    },
    {
        artisan_id: null,
        name: 'Reclaimed Wood Coffee Table',
        description: 'Rustic coffee table crafted from reclaimed mahogany wood.',
        category: ['furniture'],
        price: 275.00,
        images: [
            'https://example.com/table1.jpg',
            'https://example.com/table2.jpg'
        ],
        stock_quantity: 5,
        availability_status: 'made_to_order',
        tags: ['sustainable', 'woodwork']
    }
];
export { users, reviews, artisans, products };