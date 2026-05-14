import type {Product} from "./types.mts"

const baseURL = import.meta.env.PUBLIC_SERVER_URL || "http://localhost:3000/api/v1/";

function convertToJson(res:Response) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

// export function getData(category = "tents") {
//   return fetch(`../json/${category}.json`)
//     .then(convertToJson)
//     .then((data) => data);
// }

export function getData(category = "tents") {
  return fetch(baseURL + `products?category=${category}`)
    .then(convertToJson)
    .then((data) => data);
}

export async function findProductById(id:string, category = "tents") {
  const products = await getData(category);
  return products.find((item:Product) => item.id === id);
}