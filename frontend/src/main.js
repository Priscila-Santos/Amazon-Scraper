function renderStars(rating, reviewCount) {
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.gap = "8px";

  const starsDiv = document.createElement("div");
  starsDiv.className = "stars";
  starsDiv.style.display = "flex";
  starsDiv.style.gap = "2px";

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const maxStars = 5;

  for (let i = 0; i < fullStars; i++) {
    const star = document.createElement("div");
    star.className = "star";
    starsDiv.appendChild(star);
  }

  if (hasHalfStar) {
    const halfStar = document.createElement("div");
    halfStar.className = "half-star";
    starsDiv.appendChild(halfStar);
  }

  const totalStars = fullStars + (hasHalfStar ? 1 : 0);
  for (let i = totalStars; i < maxStars; i++) {
    const emptyStar = document.createElement("div");
    emptyStar.className = "star";
    emptyStar.style.backgroundColor = "#ccc";
    starsDiv.appendChild(emptyStar);
  }

  const ratingText = document.createElement("span");
  ratingText.textContent = `${rating.toFixed(1)}`;
  ratingText.style.fontWeight = "bold";
  ratingText.style.color = "#333";

  container.appendChild(starsDiv);
  container.appendChild(ratingText);

  return container;
}

document.getElementById("searchBtn").addEventListener("click", async () => {
  const keyword = document.getElementById("keyword").value.trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "🔄 Carregando produtos...";

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

    resultsDiv.innerHTML = "";
    data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "product";

      const img = document.createElement("img");
      img.src = item.image;
      img.alt = "Produto";

      const title = document.createElement("h3");
      title.textContent = item.title;

      const rating = parseFloat(item.rating);
      const stars = isNaN(rating) ? document.createElement("p") : renderStars(rating);
      if (isNaN(rating)) stars.textContent = "⭐ Sem avaliação";

      const reviews = document.createElement("p");
      reviews.textContent = `📝 ${item.reviewCount} avaliações`;

      card.append(img, title, stars, reviews);
      resultsDiv.appendChild(card);
    });
  } catch (err) {
    resultsDiv.innerHTML = `<p style="color:red">Erro: ${err.message}</p>`;
  }
});
