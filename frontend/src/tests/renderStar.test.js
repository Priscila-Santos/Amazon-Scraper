import { describe, it, beforeAll, expect } from 'vitest';

let renderStars;

// 1) Antes de qualquer import, crio no DOM o que main.js espera
beforeAll(async () => {
  document.body.innerHTML = `
    <button id="searchBtn"></button>
    <input id="keyword"/>
    <section id="results"></section>
  `;

  // 2) Agora importo o main.js (ele anexa listener mas o DOM já existe)
  const mod = await import('../main.js');
  renderStars = mod.renderStars;
});

describe('renderStars', () => {
  function countByClass(el, cls) {
    return el.querySelectorAll(`.${cls}`).length;
  }

  it('3 estrelas completas e 2 vazias para rating 3.0', () => {
    const container = renderStars(3.0);
    expect(countByClass(container, 'star')).toBe(5);
    expect(container.querySelector('span')).toHaveTextContent('3.0');
  });

  it('4 completas, 1 meia e 0 vazias para rating 4.3', () => {
    const container = renderStars(4.3);
    expect(countByClass(container, 'star')).toBe(4);
    expect(countByClass(container, 'half-star')).toBe(1);
    expect(container.querySelector('span')).toHaveTextContent('4.3');
  });

  it('4 estrelas completas, 0 meia e 1 vazia para rating 4.2', () => {
    const container = renderStars(4.2);
    expect(countByClass(container, 'star')).toBe(5);      // 4 cheias + 1 vazia
    expect(countByClass(container, 'half-star')).toBe(0);
    expect(container.querySelector('span')).toHaveTextContent('4.2');
  });

  it('0 completas e 5 vazias para rating 0', () => {
    const container = renderStars(0);
    expect(countByClass(container, 'star')).toBe(5);
    expect(countByClass(container, 'half-star')).toBe(0);
    expect(container.querySelector('span')).toHaveTextContent('0.0');
  });

});
