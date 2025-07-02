const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

// Snippets API
app.get('/api/snippets', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT 
        s.*, 
        (SELECT COUNT(*) FROM favorites WHERE snippet_id = s.id) > 0 as is_favorited,
        COALESCE(json_agg(t.*) FILTER (WHERE t.id IS NOT NULL), '[]') as tags
      FROM snippets s
      LEFT JOIN snippet_tags st ON s.id = st.snippet_id
      LEFT JOIN tags t ON st.tag_id = t.id
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `)
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
})

app.post('/api/snippets', async (req, res) => {
    try {
        const { title, content, language, is_public, tags } = req.body
        const slug =
            title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '') +
            '-' +
            Math.random().toString(36).substr(2, 6)

        const newSnippet = await pool.query(
            'INSERT INTO snippets (title, content, language, is_public, slug) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, content, language, is_public, slug],
        )

        if (tags && tags.length > 0) {
            const tagInserts = tags.map((tag) =>
                pool.query(
                    'INSERT INTO snippet_tags (snippet_id, tag_id) VALUES ($1, $2)',
                    [newSnippet.rows[0].id, tag.id],
                ),
            )
            await Promise.all(tagInserts)
        }

        res.json(newSnippet.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
})

app.put('/api/snippets/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { title, content, language, is_public, tags } = req.body

        const updatedSnippet = await pool.query(
            'UPDATE snippets SET title = $1, content = $2, language = $3, is_public = $4, updated_at = now() WHERE id = $5 RETURNING *',
            [title, content, language, is_public, id],
        )

        await pool.query('DELETE FROM snippet_tags WHERE snippet_id = $1', [id])
        if (tags && tags.length > 0) {
            const tagInserts = tags.map((tag) =>
                pool.query(
                    'INSERT INTO snippet_tags (snippet_id, tag_id) VALUES ($1, $2)',
                    [id, tag.id],
                ),
            )
            await Promise.all(tagInserts)
        }

        res.json(updatedSnippet.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
})

app.delete('/api/snippets/:id', async (req, res) => {
    try {
        const { id } = req.params
        await pool.query('DELETE FROM snippets WHERE id = $1', [id])
        res.status(204).send()
    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
})

// Tags API
app.get('/api/tags', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tags')
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
})

// Favorites API
app.get('/api/favorites', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT 
        s.*, 
        'true' as is_favorited,
        COALESCE(json_agg(t.*) FILTER (WHERE t.id IS NOT NULL), '[]') as tags
      FROM snippets s
      JOIN favorites f ON s.id = f.snippet_id
      LEFT JOIN snippet_tags st ON s.id = st.snippet_id
      LEFT JOIN tags t ON st.tag_id = t.id
      GROUP BY s.id
      ORDER BY f.created_at DESC
    `)
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
})

app.post('/api/favorites', async (req, res) => {
    try {
        const { snippet_id, user_id } = req.body
        const newFavorite = await pool.query(
            'INSERT INTO favorites (snippet_id, user_id) VALUES ($1, $2) RETURNING *',
            [snippet_id, user_id],
        )
        res.json(newFavorite.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
})

app.delete('/api/favorites/:snippet_id', async (req, res) => {
    try {
        const { snippet_id } = req.params
        // Assuming a user_id is available in a real app
        // For now, we'll just delete the favorite regardless of user
        await pool.query('DELETE FROM favorites WHERE snippet_id = $1', [
            snippet_id,
        ])
        res.status(204).send()
    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
})

// Health check endpoints
app.get('/health', (req, res) => {
    res.status(200).send('OK')
})

app.get('/startup', async (req, res) => {
    try {
        await pool.query('SELECT 1') // Check database connection
        res.status(200).send('OK')
    } catch (err) {
        console.error('Startup probe failed:', err)
        res.status(500).send('Error')
    }
})

app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`)
})
