import { Schema, model } from "mongoose";
import { OrderStatus, CartStatus, IProduct, ICustomer, IOrder, ICart, IReview } from "./interfaces"; 

// ==========================================
// 1. PRODUCT SCHEMA
// ==========================================
const ProductSchema = new Schema<IProduct>({
  name: { 
    type: String, 
    required: [true, "Product name is required"] 
  },
  brand: { 
    type: String, 
    required: [true, "Brand is required"] 
  },
  description: { 
    type: String, 
    required: [true, "Description is required"] 
  },
  price: { 
    type: Number, 
    required: [true, "Price is required"], 
    min: [0, "Price cannot be negative"] 
  },
  inventory: { 
    type: Number, 
    required: [true, "Inventory count is required"], 
    min: [0, "Inventory cannot be negative"],
    validate: {
      validator: Number.isInteger,
      message: "Inventory must be an integer"
    }
  },
  reviews: [{ 
    type: Schema.Types.ObjectId, 
    ref: "Review" 
  }]
}, { timestamps: true });


// ==========================================
// 2. CUSTOMER SCHEMA
// ==========================================
const CustomerSchema = new Schema<ICustomer>({
  name: { 
    type: String, 
    required: [true, "Customer name is required"] 
  },
  phone: { 
    type: String, 
    required: [true, "Phone number is required"] 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true, 
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
  },
  DOB: { 
    type: Date, 
    required: false 
  }
}, { timestamps: true });


// ==========================================
// 3. ORDER SCHEMA
// ==========================================
const OrderSchema = new Schema<IOrder>({
  customerId: { 
    type: Schema.Types.ObjectId, 
    ref: "Customer", 
    required: [true, "Order must belong to a customer"] 
  },
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtPurchase: { type: Number, required: true, min: 0 }
  }],
  status: { 
    type: String, 
    required: true, 
    enum: Object.values(OrderStatus), 
    default: OrderStatus.Received 
  },
  orderDate: { 
    type: Date, 
    default: Date.now, 
    required: true 
  },
  totalPrice: { 
    type: Number, 
    required: [true, "Total price is required"], 
    min: 0 
  }
}, { timestamps: true });


// ==========================================
// 4. CART SCHEMA
// ==========================================
const CartSchema = new Schema<ICart>({
  customerId: { 
    type: Schema.Types.ObjectId, 
    ref: "Customer", 
    required: [true, "Cart must belong to a customer"],
    unique: true 
  },
  status: { 
    type: String, 
    required: true, 
    enum: Object.values(CartStatus), 
    default: CartStatus.NotOrdered 
  },
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 }
  }]
}, { timestamps: true });


// ==========================================
// 5. REVIEW SCHEMA
// ==========================================
const ReviewSchema = new Schema<IReview>({
  customerId: { 
    type: Schema.Types.ObjectId, 
    ref: "Customer", 
    required: [true, "Review must have an author"] 
  },
  productId: { 
    type: Schema.Types.ObjectId, 
    ref: "Product", 
    required: [true, "Review must target a product"] 
  },
  rating: { 
    type: Number, 
    required: [true, "Rating is required"], 
    min: [1, "Rating must be at least 1"], 
    max: [5, "Rating cannot be more than 5"],
    validate: {
      validator: Number.isInteger,
      message: "Rating must be a whole number"
    }
  },
  comment: { 
    type: String, 
    required: false 
  },
  reviewDate: { 
    type: Date, 
    default: Date.now, 
    required: true 
  }
}, { timestamps: true });


// --- Export Models ---
export const Product = model<IProduct>("Product", ProductSchema);
export const Customer = model<ICustomer>("Customer", CustomerSchema);
export const Order = model<IOrder>("Order", OrderSchema);
export const Cart = model<ICart>("Cart", CartSchema);
export const Review = model<IReview>("Review", ReviewSchema);