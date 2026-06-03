import { useState, useEffect } from 'react';

/* ─────────────────────────────────────────
   SEED DATA  (mirrors your existing arrays)
───────────────────────────────────────── */
const SEED_CATS = [
  { id: 'top',    label: 'Top',    seeded: true },
  { id: 'bottom', label: 'Bottom', seeded: true },
];

const SEED_PRODUCTS = [
  // ── tops ──
  { uid:'top-7',  id:7,  category:'top',    price:'$89',  name:'Wool Blazer',         seeded:true },
  { uid:'top-3',  id:3,  category:'top',    price:'$74',  name:'Linen Shirt',          seeded:true },
  { uid:'top-6',  id:6,  category:'top',    price:'$95',  name:'Oxford Button-Up',     seeded:true },
  { uid:'top-4',  id:4,  category:'top',    price:'$110', name:'Pinstripe Overshirt',  seeded:true },
  { uid:'top-2',  id:2,  category:'top',    price:'$82',  name:'Denim Pullover',       seeded:true },
  { uid:'top-9',  id:9,  category:'top',    price:'$68',  name:'Poplin Shirt',         seeded:true },
  { uid:'top-8',  id:8,  category:'top',    price:'$91',  name:'Slate Overshirt',      seeded:true },
  { uid:'top-5',  id:5,  category:'top',    price:'$78',  name:'Cotton Chore Coat',    seeded:true },
  { uid:'top-1',  id:1,  category:'top',    price:'$72',  name:'Classic White Blouse', seeded:true },
  { uid:'top-10', id:10, category:'top',    price:'$65',  name:'Tan Short Sleeve',     seeded:true },
  // ── bottoms ──
  { uid:'btm-1',  id:1,  category:'bottom', price:'$79',  name:'Wool Trousers',  seeded:true },
  { uid:'btm-2',  id:2,  category:'bottom', price:'$92',  name:'Slate Chinos',   seeded:true },
  { uid:'btm-3',  id:3,  category:'bottom', price:'$65',  name:'Olive Cargo',    seeded:true },
  { uid:'btm-4',  id:4,  category:'bottom', price:'$88',  name:'Cream Wide-Leg', seeded:true },
  { uid:'btm-5',  id:5,  category:'bottom', price:'$71',  name:'Charcoal Slim',  seeded:true },
  { uid:'btm-6',  id:6,  category:'bottom', price:'$99',  name:'Navy Pleated',   seeded:true },
  { uid:'btm-7',  id:7,  category:'bottom', price:'$84',  name:'Grey Tapered',   seeded:true },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function load(key, fallback) {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch {
    return fallback;
  }
}

/* ─────────────────────────────────────────
   HOOK
───────────────────────────────────────── */
export function useStore() {
  const [cats,  setCats]  = useState(() => load('itoutfit_cats',  SEED_CATS));
  const [prods, setProds] = useState(() => load('itoutfit_prods', SEED_PRODUCTS));

  /* persist on every change */
  useEffect(() => { localStorage.setItem('itoutfit_cats',  JSON.stringify(cats));  }, [cats]);
  useEffect(() => { localStorage.setItem('itoutfit_prods', JSON.stringify(prods)); }, [prods]);

  /* ── CATEGORY actions ── */
  const addCat = (label) => {
    const trimmed = label.trim();
    if (!trimmed) return false;
    const id = trimmed.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (cats.find(c => c.id === id)) return false;
    setCats(prev => [...prev, { id, label: trimmed, seeded: false }]);
    return true;
  };

  const deleteCat = (id) => {
    if (['top', 'bottom'].includes(id)) return false; // protect originals
    setCats(prev => prev.filter(c => c.id !== id));
    setProds(prev => prev.filter(p => p.category !== id));
    return true;
  };

  /* ── PRODUCT actions ── */
  const addProd = (data) => {
    const uid = `custom-${Date.now()}`;
    setProds(prev => [...prev, { ...data, uid, seeded: false, createdAt: Date.now() }]);
    return uid;
  };

  const updateProd = (uid, patch) =>
    setProds(prev => prev.map(p => p.uid === uid ? { ...p, ...patch } : p));

  const deleteProd = (uid) =>
    setProds(prev => prev.filter(p => p.uid !== uid));

  /* ── SELECTORS ── */
  const byCategory  = (catId) => prods.filter(p => p.category === catId);
  const customProds = prods.filter(p => !p.seeded);

  return {
    cats, prods, customProds,
    byCategory,
    addCat, deleteCat,
    addProd, updateProd, deleteProd,
  };
}