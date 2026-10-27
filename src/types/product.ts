/** One product as returned by DummyJSON (only the fields this app uses). */
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  brand?: string; // some products (e.g. groceries) have no brand
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
}

/** GET /products response: the array lives in `products`, the count in `total`. */
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
