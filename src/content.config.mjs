import { defineCollection } from "astro:content";

const products = defineCollection({
  loader: async () => {
    try {
      const baseUrl = import.meta.env.PUBLIC_SERVER_URL;

      if (!baseUrl) {
        console.error(
          "❌ PUBLIC_SERVER_URL is undefined in the frontend .env file!"
        );
        return [];
      }

      const response = await fetch(
        `${baseUrl}products?limit=200`
      );

      if (!response.ok) {
        console.error(
          `❌ API fetch failed with status: ${response.status}`
        );
        return [];
      }

      const data = await response.json();

      // Support the possible API response formats.
      const results =
        data.products ??
        data.results ??
        (Array.isArray(data) ? data : []);

      if (!Array.isArray(results)) {
        console.error(
          "❌ Expected a product array, but received:",
          data
        );
        return [];
      }

      return results
        .filter((product) => product?.id || product?._id)
        .map((product) => {
          const cleanedImages = { ...(product.images || {}) };

          for (const size in cleanedImages) {
            const imageUrl = cleanedImages[size];

            if (
              typeof imageUrl === "string" &&
              imageUrl.includes("server-nodejs.cit.byui.edu")
            ) {
              cleanedImages[size] = imageUrl.replace(
                "http://server-nodejs.cit.byui.edu:3000",
                "https://wdd360.netlify.app"
              );
            }
          }

          return {
            ...product,

            // Astro requires every content entry to have a
            // unique string ID.
            id: String(product.id || product._id),

            images: cleanedImages
          };
        });
    } catch (error) {
      console.error("❌ Astro Content Loader failed:", error);
      return [];
    }
  }
});

export const collections = { products };