// my thought process
// i tried to keep the data simple and easy to follow
// i kept some data together when it made sense, like products inside the cart
// i used ids to connect bigger things like users and orders
// i kept some product info inside orders so old orders still look correct later on
// i also tried to avoid making the documents way too big

export const productSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Product",
    type: "object",
    required: ["_id", "name", "description", "price", "category", "images", "inventory"],
    properties: {
      _id: { type: "string" },
      name: { type: "string", minLength: 1 },
      description: { type: "string" },
      price: { type: "number", minimum: 0 },
      category: { type: "string" },
      images: {
        type: "array",
        items: { type: "string" }
      },
      inventory: { type: "number", minimum: 0 },
      colors: {
        type: "array",
        items: { type: "string" }
      },
      createdAt: { type: "string", format: "date-time" },
      modifiedAt: { type: "string", format: "date-time" }
    }
  };
  
  export const userSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "User",
    type: "object",
    required: ["_id", "username", "email", "password", "createdAt"],
    properties: {
      _id: { type: "string" },
      username: { type: "string", minLength: 3 },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 8 },
      orderHistory: {
        type: "array",
        items: { type: "string" }
      },
      createdAt: { type: "string", format: "date-time" },
      modifiedAt: { type: "string", format: "date-time" }
    }
  };
  
  export const cartSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Cart",
    type: "object",
    required: ["_id", "userId", "items", "createdAt"],
    properties: {
      _id: { type: "string" },
      userId: { type: "string" },
      items: {
        type: "array",
        items: {
          type: "object",
          required: ["productId", "name", "price", "quantity"],
          properties: {
            productId: { type: "string" },
            name: { type: "string" },
            price: { type: "number", minimum: 0 },
            quantity: { type: "number", minimum: 1 },
            image: { type: "string" }
          }
        }
      },
      createdAt: { type: "string", format: "date-time" },
      modifiedAt: { type: "string", format: "date-time" }
    }
  };
  
  export const orderSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Order",
    type: "object",
    required: ["_id", "userId", "items", "totalCost", "shippingInfo", "status", "createdAt"],
    properties: {
      _id: { type: "string" },
      userId: { type: "string" },
      items: {
        type: "array",
        items: {
          type: "object",
          required: ["productId", "name", "price", "quantity"],
          properties: {
            productId: { type: "string" },
            name: { type: "string" },
            price: { type: "number", minimum: 0 },
            quantity: { type: "number", minimum: 1 },
            image: { type: "string" }
          }
        }
      },
      totalCost: { type: "number", minimum: 0 },
      shippingInfo: {
        type: "object",
        required: ["name", "address", "city", "state", "zip"],
        properties: {
          name: { type: "string" },
          address: { type: "string" },
          city: { type: "string" },
          state: { type: "string" },
          zip: { type: "string" }
        }
      },
      status: {
        type: "string",
        enum: ["pending", "paid", "shipped", "delivered", "cancelled"]
      },
      createdAt: { type: "string", format: "date-time" },
      modifiedAt: { type: "string", format: "date-time" }
    }
  };
  
  export const alertSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Alert",
    type: "object",
    required: ["_id", "title", "message", "type", "status", "createdAt"],
    properties: {
      _id: { type: "string" },
      title: { type: "string", minLength: 1 },
      message: { type: "string", minLength: 1 },
      type: {
        type: "string",
        enum: ["warning", "info", "promotion", "low_inventory", "new_product"]
      },
      status: {
        type: "string",
        enum: ["active", "inactive"]
      },
      productId: { type: "string" },
      startDate: { type: "string", format: "date-time" },
      endDate: { type: "string", format: "date-time" },
      createdAt: { type: "string", format: "date-time" },
      modifiedAt: { type: "string", format: "date-time" }
    }
  };