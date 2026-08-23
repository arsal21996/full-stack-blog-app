import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Bookmark, ChevronRight, Clock3, Heart, Menu, Search, Sparkles, Star, X } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem('homecooked-saved') || '[]'));
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState('');

  const categories = useMemo(() => ['All', ...new Set(recipes.map((r) => r.category))], [recipes]);

  async function loadRecipes() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.set('search', query);
      if (category !== 'All') params.set('category', category);
      const response = await fetch(`${API}/recipes?${params}`);
      if (!response.ok) throw new Error('Could not load recipes');
      setRecipes(await response.json());
      setError('');
    } catch {
      setError('The kitchen is warming up. Start the API at http://localhost:5000 and refresh.');
    } finally { setLoading(false); }
  }

  useEffect(() => { loadRecipes(); }, [category]);

  useEffect(() => {
    const timer = setTimeout(() => loadRecipes(), 280);
    return () => clearTimeout(timer);
  }, [query]);

  function toggleSave(id) {
    const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id];
    setSaved(next);
    localStorage.setItem('homecooked-saved', JSON.stringify(next));
  }

  async function toggleFavorite(recipe) {
    try {
      const response = await fetch(`${API}/recipes/${recipe.id}/favorite`, { method: 'POST' });
      const result = await response.json();
      setRecipes((current) => current.map((item) => item.id === recipe.id ? { ...item, favorite: result.favorite } : item));
      setSelected((current) => current?.id === recipe.id ? { ...current, favorite: result.favorite } : current);
    } catch { /* Keep the UI usable even if the API is offline. */ }
  }

  const featured = recipes[0];

  return (
    <div className="site-shell">
      <header className="nav-wrap">
        <nav className="nav container">
          <button className="brand" onClick={() => { setSelected(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <span className="brand-mark">HC</span><span>home<span>cooked</span></span>
          </button>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <a href="#recipes" onClick={() => setMenuOpen(false)}>Recipes</a>
            <a href="#categories" onClick={() => setMenuOpen(false)}>Collections</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>Our kitchen</a>
          </div>
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
          <button className="saved-btn" onClick={() => setQuery('')}><Bookmark size={17} /> Saved <span>{saved.length}</span></button>
        </nav>
      </header>

      <main>
        <section className="hero container">
          <div className="hero-copy">
            <p className="eyebrow"><Sparkles size={15} /> Recipes worth gathering around</p>
            <h1>Good food.<br /><em>Good mood.</em></h1>
            <p className="hero-text">Simple, generous recipes for slow Sundays, busy weeknights and everything delicious in between.</p>
            <div className="search-box">
              <Search size={20} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search recipes, ingredients..." />
              <kbd>⌘ K</kbd>
            </div>
          </div>
          {featured && <button className="hero-card" onClick={() => setSelected(featured)}>
            <img src={featured.image} alt={featured.title} />
            <div className="hero-card-copy"><span>Editor's pick</span><strong>{featured.title}</strong><small><Clock3 size={14} /> {featured.time}</small></div>
            <span className="circle-arrow"><ArrowRight size={18} /></span>
          </button>}
        </section>

        <section className="category-strip container" id="categories">
          <div className="section-kicker"><span>Browse by craving</span><ChevronRight size={16} /></div>
          <div className="category-row">
            {categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
        </section>

        <section className="recipes-section container" id="recipes">
          <div className="section-heading"><div><p className="eyebrow">From our kitchen</p><h2>Make something <em>lovely.</em></h2></div><span className="recipe-count">{recipes.length} recipes</span></div>
          {error && <div className="notice">{error}</div>}
          {loading ? <div className="loading-grid">{[1,2,3].map((x) => <div className="skeleton" key={x} />)}</div> : recipes.length === 0 ? <div className="empty">No recipes found. Try another ingredient or category.</div> : <div className="recipe-grid">
            {recipes.map((recipe, index) => <RecipeCard key={recipe.id} recipe={recipe} index={index} saved={saved.includes(recipe.id)} onSave={() => toggleSave(recipe.id)} onFavorite={() => toggleFavorite(recipe)} onOpen={() => setSelected(recipe)} />)}
          </div>}
        </section>

        <section className="quote-section" id="about">
          <div className="container quote-inner"><Star size={18} fill="currentColor" /><blockquote>“The best recipes don't just feed people. They give everyone a reason to stay at the table a little longer.”</blockquote><p>— The HomeCooked kitchen</p></div>
        </section>
      </main>

      <footer className="footer"><div className="container footer-inner"><div className="brand footer-brand"><span className="brand-mark">HC</span><span>home<span>cooked</span></span></div><p>Made for home cooks, hungry friends & second helpings.</p><span>© 2026 HomeCooked</span></div></footer>

      {selected && <RecipeModal recipe={selected} saved={saved.includes(selected.id)} onSave={() => toggleSave(selected.id)} onFavorite={() => toggleFavorite(selected)} onClose={() => setSelected(null)} />}
    </div>
  );
}

function RecipeCard({ recipe, index, saved, onSave, onFavorite, onOpen }) {
  return <article className="recipe-card" style={{ '--delay': `${index * 60}ms` }}>
    <button className="image-button" onClick={onOpen}><img src={recipe.image} alt={recipe.title} /><span className="card-category">{recipe.category}</span></button>
    <div className="card-body"><div className="card-top"><span><Clock3 size={14} /> {recipe.time}</span><span>{recipe.difficulty}</span></div><button className="title-button" onClick={onOpen}><h3>{recipe.title}</h3></button><p>{recipe.description}</p><div className="card-footer"><span>By {recipe.author}</span><div className="card-actions"><button className={recipe.favorite ? 'liked' : ''} onClick={onFavorite} aria-label="Favorite"><Heart size={17} fill={recipe.favorite ? 'currentColor' : 'none'} /></button><button className={saved ? 'saved' : ''} onClick={onSave} aria-label="Save"><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} /></button></div></div></div>
  </article>;
}

function RecipeModal({ recipe, saved, onSave, onFavorite, onClose }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={(e) => e.stopPropagation()}><button className="modal-close" onClick={onClose}><X /></button><img className="modal-image" src={recipe.image} alt={recipe.title} /><div className="modal-content"><div className="modal-label">{recipe.category} · {recipe.difficulty}</div><h2>{recipe.title}</h2><p className="modal-description">{recipe.description}</p><div className="meta-row"><span><Clock3 size={16} /> {recipe.time}</span><span>Serves {recipe.servings}</span><button onClick={onFavorite}><Heart size={16} fill={recipe.favorite ? 'currentColor' : 'none'} /> {recipe.favorite ? 'Loved' : 'Love this'}</button><button onClick={onSave}><Bookmark size={16} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}</button></div><div className="recipe-columns"><div><h4>What you'll need</h4><ul>{recipe.ingredients.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h4>How to make it</h4><ol>{recipe.instructions.map((item, i) => <li key={item}><span>{String(i + 1).padStart(2, '0')}</span>{item}</li>)}</ol></div></div></div></div></div>;
}

export default App;
