// Importa a biblioteca axios para fazer requisições HTTP
import axios from "axios";

// Importa JSDOM para manipular o HTML como se fosse um DOM real
import { JSDOM } from "jsdom";

// Função principal que realiza o scraping da Amazon
export async function scrapeAmazon(keyword) {
  // Codifica o termo de busca para uso seguro na URL
  const query = encodeURIComponent(keyword);
  const url = `https://www.amazon.com/s?k=${query}`; // Monta a URL de busca

  try {
    // Faz a requisição HTTP para a página de resultados da Amazon
    const { data: html } = await axios.get(url, {
      headers: {
        // Define um User-Agent para simular um navegador real e evitar bloqueios
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.36 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9", // Idioma preferido
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8", // Tipos de conteúdo aceitos
      },
    });

    // Cria um DOM virtual com o HTML retornado
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Seleciona todos os elementos que representam produtos na página
    const productNodes = document.querySelectorAll('[data-component-type="s-search-result"]');

    // Mapeia os dados de cada produto
    const products = Array.from(productNodes).map((item) => {
      // 🔹 Extrai o título do produto
      const title =
        item.querySelector("h2 a span")?.textContent?.trim() ||
        item.querySelector("h2 span")?.textContent?.trim() ||
        item.querySelector("h2")?.textContent?.trim() ||
        "Sem título";

      // 🔹 Extrai a avaliação (ex: "4.5 out of 5 stars")
      const ratingText = item.querySelector("span.a-icon-alt")?.textContent?.trim();
      const rating = ratingText?.match(/[\d.]+/)?.[0] || "Sem avaliação";

      // 🔹 Extrai o número de avaliações
      const reviewCount =
        item.querySelector("span[aria-label*='ratings']")?.textContent?.trim() ||
        item.querySelector("span[aria-label*='rating']")?.textContent?.trim() ||
        item.querySelector(".a-size-base")?.textContent?.trim() ||
        "Sem número de avaliações";

      // 🔹 Extrai a URL da imagem do produto
      const image = item.querySelector("img.s-image")?.getAttribute("src") || "";

      // Retorna os dados estruturados
      return { title, rating, reviewCount, image };
    });

    // 🔹 Filtra produtos que não têm título ou imagem (dados incompletos)
    return products.filter((p) => p.title !== "Sem título" && p.image);
  } catch (err) {
    // Em caso de erro, exibe no terminal e lança exceção para o backend tratar
    console.error("Erro ao fazer scraping:", err);
    throw new Error("Erro ao acessar a Amazon");
  }
}
