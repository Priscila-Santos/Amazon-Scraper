// import { describe, it, expect, beforeEach } from 'vitest';
// import { fireEvent, getByText, getByRole, findAllByText } from '@testing-library/dom';
// import '../main.js'; // injeta o listener no DOM

// beforeEach(() => {
//   document.body.innerHTML = `
//     <input type="text" id="keyword" />
//     <button id="searchBtn">Pesquisar</button>
//     <section id="results"></section>
//   `;
//   global.fetch = jest.fn();
// });

// afterEach(() => {
//   jest.resetAllMocks();
// });

// test('renderiza cards quando a API retorna produtos', async () => {
//   const fakeData = [
//     { image: 'img1.jpg', title: 'Produto 1', rating: '4.5', reviewCount: 10 },
//     { image: 'img2.jpg', title: 'Produto 2', rating: 'NaN', reviewCount: 0 }
//   ];
//   fetch.mockResolvedValueOnce({
//     status: 200,
//     json: async () => fakeData
//   });

//   const { getByRole, findByText, container } = document;
//   const btn = getByRole(container, 'button', { name: /pesquisar/i });
//   document.getElementById('keyword').value = 'celular';

//   fireEvent.click(btn);
//   // Verifica loading
//   expect(getByText(container, '🔄 Carregando produtos...')).toBeInTheDocument();

//   // Aguarda cards aparecerem
//   const card1 = await findByText(container, 'Produto 1');
//   const card2 = await findByText(container, 'Produto 2');

//   expect(card1).toBeInTheDocument();
//   expect(card2).toBeInTheDocument();
//   expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/scrape?keyword=celular');
// });

// test('exibe mensagem "Nenhum produto encontrado." para array vazio', async () => {
//   fetch.mockResolvedValueOnce({
//     status: 200,
//     json: async () => []
//   });

//   fireEvent.click(document.getElementById('searchBtn'));
//   const msg = await getByText(document, 'Nenhum produto encontrado.');
//   expect(msg).toBeInTheDocument();
// });

// test('lança erro de API com status 500', async () => {
//   fetch.mockResolvedValueOnce({
//     status: 500,
//     json: async () => ({ error: 'Falha interna' })
//   });

//   fireEvent.click(document.getElementById('searchBtn'));
//   const errMsg = await getByRole(document, 'region', { name: /erro/i })
//     .catch(() => getByText(document, /Erro: Falha interna/));

//   expect(errMsg).toBeInTheDocument();
// });

// test('exibe mensagem de erro em caso de falha de rede', async () => {
//   fetch.mockRejectedValueOnce(new Error('Network failure'));

//   fireEvent.click(document.getElementById('searchBtn'));
//   const err = await getByText(document, /Erro: Network failure/);
//   expect(err).toHaveStyle('color: red');
// });
import { describe, it, expect, beforeEach } from 'vitest';
import { fireEvent, getByText, getByRole, findByText } from '@testing-library/dom';

describe('fluxo de busca', () => {
  beforeEach(async () => {
    // 1) monta o DOM antes de importar main.js
    document.body.innerHTML = `
      <input type="text" id="keyword" />
      <button id="searchBtn">Pesquisar</button>
      <section id="results"></section>
    `;

    // 2) importa e executa o código que faz o addEventListener
    await import('../main.js');
  });

  it('renderiza cards quando a API retorna produtos', async () => {
    const fakeData = [
      { image: 'img1.jpg', title: 'Produto 1', rating: '4.5', reviewCount: 10 },
      { image: 'img2.jpg', title: 'Produto 2', rating: 'NaN', reviewCount: 0 }
    ];

    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: async () => fakeData
    });

    const btn = getByRole(document.body, 'button', { name: /pesquisar/i });
    document.getElementById('keyword').value = 'celular';

    fireEvent.click(btn);
    expect(getByText(document.body, '🔄 Carregando produtos...')).toBeInTheDocument();

    const card1 = await findByText(document.body, 'Produto 1');
    const card2 = await findByText(document.body, 'Produto 2');

    expect(card1).toBeInTheDocument();
    expect(card2).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/scrape?keyword=celular'
    );
  });

  // demais cenários…
});