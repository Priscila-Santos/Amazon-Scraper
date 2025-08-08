import axios from "axios";
import { JSDOM } from "jsdom";

export async function scrapeAmazon(keyword) {
  const query = encodeURIComponent(keyword);
  const url = `https://www.amazon.com/s?k=${query}`;

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.36 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    });

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const productNodes = document.querySelectorAll('[data-component-type="s-search-result"]');

    const products = Array.from(productNodes).map((item) => {
      // 🔹 Título
      const title =
        item.querySelector("h2 a span")?.textContent?.trim() ||
        item.querySelector("h2 span")?.textContent?.trim() ||
        item.querySelector("h2")?.textContent?.trim() ||
        "Sem título";

      // 🔹 Avaliação (ex: "4.5 out of 5 stars")
      const ratingText = item.querySelector("span.a-icon-alt")?.textContent?.trim();
      const rating = ratingText?.match(/[\d.]+/)?.[0] || "Sem avaliação";

      // 🔹 Número de avaliações
      const reviewCount =
        item.querySelector("span[aria-label*='ratings']")?.textContent?.trim() ||
        item.querySelector("span[aria-label*='rating']")?.textContent?.trim() ||
        item.querySelector(".a-size-base")?.textContent?.trim() ||
        "Sem número de avaliações";

      // 🔹 Imagem
      const image = item.querySelector("img.s-image")?.getAttribute("src") || "";

      return { title, rating, reviewCount, image };
    });

    // 🔹 Filtra produtos sem título ou imagem
    return products.filter((p) => p.title !== "Sem título" && p.image);
  } catch (err) {
    console.error("Erro ao fazer scraping:", err);
    throw new Error("Erro ao acessar a Amazon");
  }
}