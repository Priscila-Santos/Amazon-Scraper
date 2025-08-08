// Importa a função responsável por fazer o scraping da Amazon
import { scrapeAmazon } from "./scraper.js";

// Cria o servidor HTTP usando Bun
const server = Bun.serve({
  port: 3000, 

  // Função que trata todas as requisições recebidas
  async fetch(req) {
    // Converte a URL da requisição para um objeto manipulável
    const url = new URL(req.url); 

    // 🔹 Define os cabeçalhos CORS para permitir requisições do frontend
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Permite acesso de qualquer origem
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Métodos permitidos
      "Access-Control-Allow-Headers": "Content-Type", // Cabeçalhos permitidos
    };

    // 🔹 Trata requisições do tipo OPTIONS (pré-flight), comuns em chamadas CORS
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders }); // Retorna resposta vazia com os headers CORS
    }

    // 🔹 Verifica se a rota é /api/scrape e se o método é GET
    if (url.pathname === "/api/scrape" && req.method === "GET") {
      const keyword = url.searchParams.get("keyword"); // Extrai o parâmetro ?keyword da URL

      // 🔹 Valida se o parâmetro foi fornecido
      if (!keyword) {
        return new Response(
          JSON.stringify({ error: "Parâmetro ?keyword é obrigatório" }), 
          {
            status: 400, // Código de erro HTTP 400 (Bad Request)
            headers: { ...corsHeaders, "Content-Type": "application/json" }, // Cabeçalhos da resposta
          }
        );
      }

      try {
        // 🔹 Chama a função de scraping passando o termo de busca
        const results = await scrapeAmazon(keyword);

        // 🔹 Retorna os dados extraídos em formato JSON
        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        // 🔹 Em caso de erro no scraping, retorna erro 500
        return new Response(
          JSON.stringify({ error: "Erro ao extrair dados da Amazon" }),
          {
            status: 500, // Código de erro HTTP 500 (Internal Server Error)
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // 🔹 Se a rota não for reconhecida, retorna erro 404
    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
});

// Exibe no terminal que o backend está rodando
console.log(`✅ Backend rodando em http://localhost:3000`);

