export type Product = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
};

export type Artisan = {
  id: number;
  name: string;
  specialty: string;
  bio: string;
  imageUrl: string;
  location: string;
  products: Product[];
};

export const mockArtisans: Artisan[] = [
  {
    id: 5,
    name: "Emma Thompson",
    specialty: "Ceramics",
    bio: "Creating handcrafted pottery for over 15 years, specializing in functional pieces that bring beauty to everyday life.",
    imageUrl: "/images/artisans/art1.jpeg",
    location: "Portland, OR",
    products: [
      {
        id: 1,
        name: "Ceramic Vase",
        imageUrl: "/images/products/prod1.jpeg",
        price: 85,
      },
      {
        id: 2,
        name: "Hand-painted Bowl",
        imageUrl: "/images/products/prod2.jpeg",
        price: 65,
      },
      {
        id: 3,
        name: "Decorative Plate",
        imageUrl: "/images/products/prod3.jpeg",
        price: 45,
      },
    ],
  },
  {
    id: 2,
    name: "James Wilson",
    specialty: "Woodworking",
    bio: "Master woodworker with a passion for creating unique furniture pieces that combine traditional techniques with modern design.",
    imageUrl: "/images/artisans/art2.jpeg",
    location: "Seattle, WA",
    products: [
      {
        id: 4,
        name: "Walnut Coffee Table",
        imageUrl: "/images/products/prod4.jpeg",
        price: 450,
      },
      {
        id: 5,
        name: "Oak Shelf",
        imageUrl: "/images/products/prod5.jpeg",
        price: 175,
      },
    ],
  },
  {
    id: 3,
    name: "Sarah Chen",
    specialty: "Textile Arts",
    bio: "Weaving stories through threads, creating vibrant tapestries that blend traditional techniques with contemporary design.",
    imageUrl: "/images/artisans/art3.jpeg",
    location: "San Francisco, CA",
    products: [
      {
        id: 6,
        name: "Handwoven Tapestry",
        imageUrl: "/images/products/prod6.jpeg",
        price: 350,
      },
      {
        id: 7,
        name: "Textile Wall Hanging",
        imageUrl: "/images/products/prod7.jpeg",
        price: 275,
      },
    ],
  },
  {
    id: 4,
    name: "Michael Rodriguez",
    specialty: "Glass Blowing",
    bio: "Transforming molten glass into elegant pieces that capture light and color in unique ways.",
    imageUrl: "/images/artisans/art4.jpeg",
    location: "Austin, TX",
    products: [
      {
        id: 8,
        name: "Blown Glass Vase",
        imageUrl: "/images/products/prod8.jpeg",
        price: 225,
      },
      {
        id: 9,
        name: "Glass Sculpture",
        imageUrl: "/images/products/prod9.jpeg",
        price: 380,
      },
    ],
  },
  {
    id: 1,
    name: "Lisa Patel",
    specialty: "Jewelry Making",
    bio: "Crafting unique jewelry pieces that tell stories through precious metals and stones.",
    imageUrl: "/images/artisans/art5.jpeg",
    location: "New York, NY",
    products: [
      {
        id: 10,
        name: "Silver Pendant",
        imageUrl: "/images/products/prod10.jpeg",
        price: 150,
      },
      {
        id: 11,
        name: "Handcrafted Ring",
        imageUrl: "/images/products/prod11.jpeg",
        price: 200,
      },
    ],
  },
]; 