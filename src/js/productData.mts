import type {Product} from "./types.mts"

function convertToJson(res:Response) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export function getData(category = "tents") {
  // had to change the file path cause the old one was looking in the wrong place for the json file
  return fetch(`/json/${category}.json`)
    .then(convertToJson)
    .then((data) => data);
}

export async function findProductById(id:string) {
  const products = await getData();
  return products.find((item:Product) => item.id === id);
}
