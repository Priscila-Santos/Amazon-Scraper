// Função que renderiza as estrelas de avaliação visualmente
function renderStars(rating, reviewCount) {
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.gap = "8px";

  const starsDiv = document.createElement("div");
  starsDiv.className = "stars";
  starsDiv.style.display = "flex";
  starsDiv.style.gap = "2px";

  const fullStars = Math.floor(rating); // Número de estrelas completas
  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75; // Verifica se há meia estrela
  const maxStars = 5; // Total de estrelas possíveis

  // Adiciona estrelas completas
  for (let i = 0; i < fullStars; i++) {
    const star = document.createElement("div");
    star.className = "star";
    starsDiv.appendChild(star);
  }

  // Adiciona meia estrela, se necessário
  if (hasHalfStar) {
    const halfStar = document.createElement("div");
    halfStar.className = "half-star";
    starsDiv.appendChild(halfStar);
  }

  // Adiciona estrelas vazias para completar até 5
  const totalStars = fullStars + (hasHalfStar ? 1 : 0);
  for (let i = totalStars; i < maxStars; i++) {
    const emptyStar = document.createElement("div");
    emptyStar.className = "star";
    emptyStar.style.backgroundColor = "#ccc"; // Estilo para estrela vazia
    starsDiv.appendChild(emptyStar);
  }

  // Adiciona o número da avaliação 
  const ratingText = document.createElement("span");
  ratingText.textContent = `${rating.toFixed(1)}`; 
  ratingText.style.fontWeight = "bold";
  ratingText.style.color = "#333";

  // Junta as estrelas e o texto no container
  container.appendChild(starsDiv);
  container.appendChild(ratingText);

  return container;
}

// Evento que dispara quando o botão de busca é clicado
document.getElementById("searchBtn").addEventListener("click", async () => {
  const keyword = document.getElementById("keyword").value.trim(); // Pega o termo digitado
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "🔄 Carregando produtos..."; // Feedback visual de carregamento

  try {
    // Faz a requisição para o backend passando o termo de busca
    const res = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    const data = await res.json(); // Converte a resposta para JSON

    // Verifica se houve erro na resposta
    if (res.status !== 200) {
      throw new Error(data.error || "Erro desconhecido");
    }

    // Se não houver produtos, mostra mensagem
    if (!data.length) {
      resultsDiv.innerHTML = "Nenhum produto encontrado.";
      return;
    }

    // Limpa os resultados anteriores
    resultsDiv.innerHTML = "";

    // Para cada produto, cria um card com os dados
    data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "product";

      const img = document.createElement("img");
      img.src = item.image;
      img.alt = "Produto";

      const title = document.createElement("h3");
      title.textContent = item.title;

      const rating = parseFloat(item.rating); // Converte a avaliação para número
      const stars = isNaN(rating) ? document.createElement("p") : renderStars(rating); // Renderiza estrelas ou texto
      if (isNaN(rating)) stars.textContent = "⭐ Sem avaliação";

      const reviews = document.createElement("p");
      reviews.textContent = `📝 ${item.reviewCount} avaliações`;

      // Adiciona todos os elementos ao card
      card.append(img, title, stars, reviews);
      resultsDiv.appendChild(card); // Adiciona o card à lista de resultados
    });
  } catch (err) {
    // Em caso de erro, exibe mensagem amigável
    resultsDiv.innerHTML = `<p style="color:red">Erro: ${err.message}</p>`;
  }
});
