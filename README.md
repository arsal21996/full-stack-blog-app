# HomeCooked 🍳

A warm, editorial full-stack recipe platform built as a portfolio-ready final project. The frontend focuses on polished visual design and responsive UX, while the backend provides a small REST API for recipes, categories, and favorites.

## Highlights

- Editorial recipe homepage with responsive layouts
- Search and category filtering
- Recipe detail views with ingredients and instructions
- Favorites backed by the API
- Create and delete recipes through the REST API
- Express backend with lightweight JSON persistence
- Mobile-first styling with subtle micro-interactions
- Deployment-ready for Vercel/Netlify + Render

## Structure

```text
full-stack-blog-app/
├── frontend/   # React + Vite UI
└── backend/    # Express REST API
```

## Local setup

### Backend

```bash
cd backend
npm install
npm run dev
```

API: http://localhost:5000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

UI: http://localhost:5173

Create `frontend/.env` when the API is not on the default URL:

```env
VITE_API_URL=http://localhost:5000/api
```

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/recipes` | List/search recipes |
| GET | `/api/recipes/:id` | Get one recipe |
| POST | `/api/recipes` | Create recipe |
| DELETE | `/api/recipes/:id` | Delete recipe |
| GET | `/api/categories` | List categories |
| POST | `/api/recipes/:id/favorite` | Toggle favorite |

## Deployment

Deploy `frontend` to Vercel or Netlify and `backend` to Render. Set `VITE_API_URL` on the frontend to the deployed API URL.

## Design

HomeCooked uses an editorial, WordPress-inspired food-magazine feel: oversized typography, generous whitespace, warm neutrals, image-led cards, rounded surfaces, subtle shadows, and restrained motion.

Built as a learning and portfolio project.
