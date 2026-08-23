import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, 'data', 'recipes.json');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({ name: 'HomeCooked API', status: 'ok', message: 'The kitchen is open 🍳', health: '/api/health' });
});

async function readRecipes() { return JSON.parse(await fs.readFile(dataFile, 'utf8')); }
async function writeRecipes(recipes) { await fs.writeFile(dataFile, JSON.stringify(recipes, null, 2)); }

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'HomeCooked API' }));

app.get('/api/categories', async (_req, res, next) => {
  try { const recipes = await readRecipes(); res.json([...new Set(recipes.map((recipe) => recipe.category))]); } catch (error) { next(error); }
});

app.get('/api/recipes', async (req, res, next) => {
  try {
    const recipes = await readRecipes();
    const search = String(req.query.search || '').toLowerCase().trim();
    const category = String(req.query.category || 'All');
    const filtered = recipes.filter((recipe) => {
      const matchesSearch = !search || [recipe.title, recipe.description, recipe.category, ...recipe.ingredients].join(' ').toLowerCase().includes(search);
      const matchesCategory = category === 'All' || recipe.category === category;
      return matchesSearch && matchesCategory;
    });
    res.json(filtered);
  } catch (error) { next(error); }
});

app.get('/api/recipes/:id', async (req, res, next) => {
  try {
    const recipes = await readRecipes();
    const recipe = recipes.find((item) => item.id === req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) { next(error); }
});

app.post('/api/recipes', async (req, res, next) => {
  try {
    const { title, category, description, image, time, difficulty, servings, author, ingredients, instructions } = req.body;
    if (!title || !category || !description || !ingredients?.length || !instructions?.length) return res.status(400).json({ message: 'Title, category, description, ingredients and instructions are required.' });
    const recipes = await readRecipes();
    const recipe = { id: crypto.randomUUID(), title, category, description, image: image || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=85', time: time || '30 min', difficulty: difficulty || 'Easy', servings: Number(servings) || 2, author: author || 'HomeCooked Community', ingredients, instructions };
    recipes.unshift(recipe);
    await writeRecipes(recipes);
    res.status(201).json(recipe);
  } catch (error) { next(error); }
});

app.delete('/api/recipes/:id', async (req, res, next) => {
  try {
    const recipes = await readRecipes();
    const nextRecipes = recipes.filter((recipe) => recipe.id !== req.params.id);
    if (nextRecipes.length === recipes.length) return res.status(404).json({ message: 'Recipe not found' });
    await writeRecipes(nextRecipes);
    res.json({ message: 'Recipe deleted' });
  } catch (error) { next(error); }
});

app.post('/api/recipes/:id/favorite', async (req, res, next) => {
  try {
    const recipes = await readRecipes();
    const recipe = recipes.find((item) => item.id === req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    recipe.favorite = !recipe.favorite;
    await writeRecipes(recipes);
    res.json({ favorite: recipe.favorite });
  } catch (error) { next(error); }
});

app.use((error, _req, res, _next) => { console.error(error); res.status(500).json({ message: 'Something went wrong on the server.' }); });
app.listen(PORT, () => console.log(`HomeCooked API running on port ${PORT}`));
