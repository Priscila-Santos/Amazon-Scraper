document.getElementById("searchBtn").addEventListener("click", async () => {
  const keyword = document.getElementById("keyword").value.trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "🔄 Buscando...";

  try {
    const res = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    const data = await res.json();

    if (res.status !== 200) {
      throw new Error(data.error || "Erro desconhecido");
    }

    if (!data.length) {
      resultsDiv.innerHTML = "Nenhum produto encontrado.";
      return;
    }

    resultsDiv.innerHTML = data
      .map(
        (item) => `
        <div class="product">
          <img src="${item.image}" alt="Produto" />
          <h3>${item.title}</h3>
          <p>⭐ ${item.rating}</p>
          <p>📝 ${item.reviewCount} avaliações</p>
        </div>
      `
      )
      .join("");
  } catch (err) {
    resultsDiv.innerHTML = `<p style="color:red">Erro: ${err.message}</p>`;
  }
  
});
