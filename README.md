# 🛒 Amazon Product Scraper

Este projeto realiza o scraping de produtos da Amazon a partir da primeira página de resultados de busca, utilizando **Bun** no backend e **Vite** no frontend. Ele permite buscar produtos por palavra-chave e exibir os dados de forma moderna e responsiva.

---

## 📦 Funcionalidades

- Busca de produtos por palavra-chave
- Extração de:
  - Título do produto
  - Avaliação (0 a 5 estrelas)
  - Número de avaliações
  - URL da imagem do produto
- Interface web simples e responsiva
- Tratamento de erros no backend e frontend
- Código limpo seguindo princípios SOLID

---

## 🧰 Tecnologias Utilizadas

### Backend
- Bun
- Axios
- JSDOM
- Express

### Frontend
- Vite
- HTML, CSS e JavaScript

---

## 📁 Estrutura do Projeto

```
amazon-scraper/
├── backend/
│   ├── index.js         # Servidor Bun com endpoint /api/scrape
│   ├── scraper.js       # Função de scraping usando Axios + JSDOM
├── frontend/
│   ├── index.html       # Página principal
│   ├── main.js          # Lógica de busca e renderização
│   ├── style.css        # Estilos da interface
├── README.md            # Documentação do projeto
├── bun.lock             # Lockfile do Bun
├── package.json         # Dependências do projeto
```

---

## 🚀 Como Executar

### 1. Instale o Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Clone o repositório

```bash
git clone https://github.com/seu-usuario/amazon-scraper.git
cd amazon-scraper
```

### 3. Instale as dependências do backend

```bash
bun install axios jsdom express
```

### 4. Inicie o servidor Bun

```bash
bun run index.js
```

O servidor estará rodando em `http://localhost:3000`.

### 5. Inicie o frontend com Vite

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173` no navegador.

---

## ✅ Boas Práticas Adotadas

- Código comentado e modularizado
- Validação de parâmetros
- Tratamento de erros com mensagens claras
- Separação de responsabilidades (frontend/backend)
- Uso de headers para evitar bloqueios por bots
- Interface responsiva e acessível

---

## 🧪 Testes

Você pode adicionar testes com Vitest para o frontend e usar mocks para testar o backend. Recomenda-se testar:

- Requisições válidas e inválidas
- Renderização correta dos produtos
- Comportamento em caso de erro

---

## 📌 Observações

- O scraping depende da estrutura atual da Amazon. Mudanças no HTML podem exigir ajustes.
- O projeto é apenas para fins educacionais e não deve ser usado para fins comerciais sem autorização.



