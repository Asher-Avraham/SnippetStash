const request = require('supertest');
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool();

// Import routes from index.js (copy endpoints for test app)
app.get('/api/snippets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM snippets');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.get('/api/tags', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tags');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

describe('API Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/snippets returns snippets', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Test' }] });
    const res = await request(app).get('/api/snippets');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1, title: 'Test' }]);
  });

  test('GET /api/tags returns tags', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'tag1' }] });
    const res = await request(app).get('/api/tags');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: 'tag1' }]);
  });

  test('GET /health returns OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('OK');
  });

  test('GET /api/snippets handles error', async () => {
    pool.query.mockRejectedValueOnce(new Error('fail'));
    const res = await request(app).get('/api/snippets');
    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Server Error');
  });
});
