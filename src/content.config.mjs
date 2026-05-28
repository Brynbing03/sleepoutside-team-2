import { defineCollection } from "astro:content";

const products = defineCollection({
  loader: async () => {
    try {
      const baseUrl = import.meta.env.PUBLIC_SERVER_URL;
      
      // Safety check: Make sure your environment variable is loaded
      if (!baseUrl) {
        console.error("❌ ERROR: PUBLIC_SERVER_URL is undefined in your .env file!");
        return [];
      }

      const response = await fetch(`${baseUrl}products?limit=200`);
      
      if (!response.ok) {
        console.error(`❌ API Fetch failed with status: ${response.status}`);
        return [];
      }

      const data = await response.json();
      const results = data.results || data; // Fallback in case results is nested or direct array

      // Process and clean up the data before giving it to Astro
      return results.map((product) => {
        
        // Loop through all keys inside the product's images object
        if (product.images) {
          for (const size in product.images) {
            // Check if the property is a string and contains the broken server-nodejs link
            if (typeof product.images[size] === "string" && product.images[size].includes("server-nodejs.cit.byui.edu")) {
              product.images[size] = product.images[size].replace(
                "http://server-nodejs.cit.byui.edu:3000",
                "https://wdd360.netlify.app"
              );
            }
          }
        }

        // Return the modified product object with guaranteed ID field
        return {
          ...product,
          id: product.id || product._id || String(Math.random()), 
        };
      });

    } catch (error) {
      console.error("❌ Astro Content Loader failed:", error);
      return []; // Return empty array so the build doesn't crash completely
    }
  },
});

export const collections = { products };