// what i am thinking... 
// these interfaces help show what the data should look like
// i tried to keep everything matching the schemas file
// i reused some interfaces to keep things cleaner and more organized
// some fields are optional because they might not always be there
// everything is based around how users shop and use the website

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    inventory: number;
    colors?: string[];
    createdAt?: Date;
    modifiedAt?: Date;
  }
  
  export interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    orderHistory?: string[];
    createdAt: Date;
    modifiedAt?: Date;
  }
  
  export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }
  
  export interface Cart {
    _id: string;
    userId: string;
    items: CartItem[];
    createdAt: Date;
    modifiedAt?: Date;
  }
  
  export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }
  
  export interface ShippingInfo {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  }
  
  export interface Order {
    _id: string;
    userId: string;
    items: OrderItem[];
    totalCost: number;
    shippingInfo: ShippingInfo;
    status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
    createdAt: Date;
    modifiedAt?: Date;
  }
  
  export interface Alert {
    _id: string;
    title: string;
    message: string;
    type: "warning" | "info" | "promotion" | "low_inventory" | "new_product";
    status: "active" | "inactive";
    productId?: string;
    startDate?: Date;
    endDate?: Date;
    createdAt: Date;
    modifiedAt?: Date;
  }