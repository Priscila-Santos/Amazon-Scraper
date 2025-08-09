import { scrapeAmazon } from "./scraper.js";

// código de tratamento de requisição para uma função exportada
export async function fetch(req) {
  const url = new URL(req.url);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (url.pathname === "/api/scrape" && req.method === "GET") {
    const keyword = url.searchParams.get("keyword");
    if (!keyword) {
      return new Response(
        JSON.stringify({ error: "Parâmetro ?keyword é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    try {
      const results = await scrapeAmazon(keyword);
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch {
      return new Response(
        JSON.stringify({ error: "Erro ao extrair dados da Amazon" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  // Rota não reconhecida
  return new Response("Not Found", { status: 404, headers: corsHeaders });
}

// Só iniciamos o servidor se estivermos realmente rodando sob Bun
if (typeof Bun !== "undefined") {
  Bun.serve({
    port: 3000,
    fetch,
  });
  console.log(`✅ Backend rodando em http://localhost:3000`);
}