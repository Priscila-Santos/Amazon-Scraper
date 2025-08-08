// import { scrapeAmazon } from "./scraper.js";

// const server = Bun.serve({
//   port: 3000,
//   async fetch(req) {
//     const url = new URL(req.url); // ✅ Agora 'url' está definido aqui

//     if (url.pathname === "/api/scrape" && req.method === "GET") {
//       const keyword = url.searchParams.get("keyword");

//       if (!keyword) {
//         return new Response(JSON.stringify({ error: "Parâmetro ?keyword é obrigatório" }), {
//           status: 400,
//           headers: { "Content-Type": "application/json" },
//         });
//       }

//       try {
//         const results = await scrapeAmazon(keyword);
//         return new Response(JSON.stringify(results), {
//           headers: { "Content-Type": "application/json" },
//         });
//       } catch (error) {
//         return new Response(JSON.stringify({ error: "Erro ao extrair dados da Amazon" }), {
//           status: 500,
//           headers: { "Content-Type": "application/json" },
//         });
//       }
//     }

//     return new Response("Not Found", { status: 404 });
//   },
// });

// console.log(`✅ Backend rodando em http://localhost:${server.port}`);

import { scrapeAmazon } from "./scraper.js";

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    // 🔹 Headers comuns para CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 🔹 Pré-flight request (OPTIONS)
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

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
});

console.log(`✅ Backend rodando em http://localhost:${server.port}`);
