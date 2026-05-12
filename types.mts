// --- Enums ---

export enum OrderStatus {
  Delivered = "delivered",
  BeingDelivered = "being delivered",
  Shipped = "shipped",
  Prepped = "prepped",
  Received = "received"
}

export enum CartStatus {
  Ordered = "ordered",
  NotOrdered = "not ordered"
}

// --- Sub-Interfaces for Relationships ---

/**
 * Represents a line-item product inside an order.
 * Tracks the specific quantity and the price at the exact moment of purchase.
 */
export interface OrderProduct {
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}

/**
 * Represents an item inside a customer's shopping cart.
 */
export interface CartProduct {
  productId: string;
  quantity: number;
}

// --- Main Collection Interfaces ---

export interface IProduct {
  _id: string;
  name: string;
  brand: string;
  description: string;
  price: number;     // Minimum 0
  inventory: number; // Minimum 0
  reviews: string[]; // Array of Review IDs associated with this product
}

export interface ICustomer {
  _id: string;
  name: string;
  phone: string;     // Kept as string to preserve formatting/leading zeros
  email: string;     // Must be unique
  DOB?: Date;        // Optional field
}

export interface IOrder {
  _id: string;
  customerId: string;
  products: OrderProduct[]; 
  status: OrderStatus;
  orderDate: Date;
  totalPrice: number;
}

export interface ICart {
  _id: string;
  customerId: string;
  status: CartStatus;
  products: CartProduct[];
}

export interface IReview {
  _id: string;
  customerId: string;
  productId: string;
  rating: number;     // Integer between 1 and 5
  reviewDate: Date;
  comment?: string;   // Optional field
}