import type {Product} from "./types.mts"

function convertToJson(res:Response) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export function getData(category = "tents") {
  return fetch(`/json/${category}.json`)
    .then(convertToJson)
    .then((data) => data);
}

export async function findProductById(id:string, category = "tents") {
  const products = await getData(category);
  return products.find((item:Product) => item.id === id);
}
