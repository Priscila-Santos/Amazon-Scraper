import { describe, it, expect, vi } from 'vitest';
import { scrapeAmazon } from '../scraper.js';
import { fetch } from '../index.js'; // exporte fetch separadamente no index.js

vi.mock('../scraper.js');

describe('API /api/scrape', () => {
  const baseHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  it('retorna 400 se keyword estiver ausente', async () => {
    const req = new Request('http://localhost:3000/api/scrape');
    const res = await fetch(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Parâmetro ?keyword é obrigatório');
  });

  it('retorna dados válidos com keyword', async () => {
    const mockData = [{ title: 'Produto', rating: '4.5', reviewCount: '100', image: 'img.jpg' }];
    scrapeAmazon.mockResolvedValueOnce(mockData);

    const req = new Request('http://localhost:3000/api/scrape?keyword=teste');
    const res = await fetch(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(mockData);
  });

  it('retorna erro 500 se scrapeAmazon falhar', async () => {
    scrapeAmazon.mockRejectedValueOnce(new Error('Erro interno'));

    const req = new Request('http://localhost:3000/api/scrape?keyword=teste');
    const res = await fetch(req);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('Erro ao extrair dados da Amazon');
  });

  it('responde corretamente a OPTIONS', async () => {
    const req = new Request('http://localhost:3000/api/scrape', { method: 'OPTIONS' });
    const res = await fetch(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('retorna 404 para rota desconhecida', async () => {
    const req = new Request('http://localhost:3000/invalid');
    const res = await fetch(req);
    expect(res.status).toBe(404);
    const text = await res.text();
    expect(text).toBe('Not Found');
  });
});