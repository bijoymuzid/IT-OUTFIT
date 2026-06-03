import { useState, useRef } from 'react';
import { useStore } from '../useStore';
import './AdminPage.css';

/* ── change this to your own password ── */
const ADMIN_PASSWORD = 'ITOUTFIT2025';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const BLANK_FORM = {
  name: '', price: '', category: 'top', description: '',
  image: '', imageHover: '', sizes: ['S', 'M', 'L'], status: 'available',
};

/* ════════════════════════════════════════════
   ROOT
════════════════════════════════════════════ */
export default function AdminPage({ onExit }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('ito_admin') === '1'
  );

  const login = (pw) => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('ito_admin', '1');
      setAuthed(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('ito_admin');
    setAuthed(false);
  };

  if (!authed) return <LoginScreen onLogin={login} onExit={onExit} />;
  return <Dashboard onLogout={logout} onExit={onExit} />;
}

/* ════════════════════════════════════════════
   LOGIN SCREEN
════════════════════════════════════════════ */
function LoginScreen({ onLogin, onExit }) {
  const [pw, setPw]     = useState('');
  const [err, setErr]   = useState(false);
  const [show, setShow] = useState(false);

  const submit = () => {
    if (!onLogin(pw)) {
      setErr(true);
      setPw('');
      setTimeout(() => setErr(false), 2000);
    }
  };

  return (
    <div className="adm-login">
      <button className="adm-login__back" onClick={onExit}>← Back to site</button>

      <div className="adm-login__box">
        <p className="adm-login__label">IT OUTFIT</p>
        <h1 className="adm-login__title">Admin Access</h1>
        <p className="adm-login__sub">Restricted. Enter your credentials to continue.</p>

        <div className={`adm-login__field ${err ? 'adm-login__field--err' : ''}`}>
          <input
            type={show ? 'text' : 'password'}
            placeholder="Password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            className="adm-login__input"
            autoFocus
          />
          <button className="adm-login__eye" onClick={() => setShow(s => !s)} tabIndex={-1}>
            {show ? '●' : '○'}
          </button>
        </div>

        {err && <p className="adm-login__err">Incorrect password.</p>}

        <button className="adm-login__btn" onClick={submit}>Enter</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   DASHBOARD SHELL
════════════════════════════════════════════ */
function Dashboard({ onLogout, onExit }) {
  const [view, setView] = useState('dashboard');

  return (
    <div className="adm">
      {/* ── sidebar ── */}
      <aside className="adm-side">
        <div className="adm-side__brand">
          <span className="adm-side__brand-name">IT OUTFIT</span>
          <span className="adm-side__brand-tag">Admin</span>
        </div>

        <nav className="adm-side__nav">
          {[
            { id: 'dashboard', icon: '⊞', label: 'Dashboard'  },
            { id: 'products',  icon: '◫', label: 'Products'   },
            { id: 'categories',icon: '≡', label: 'Categories' },
          ].map(n => (
            <button
              key={n.id}
              className={`adm-side__link ${view === n.id ? 'adm-side__link--active' : ''}`}
              onClick={() => setView(n.id)}
            >
              <span className="adm-side__icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

        <div className="adm-side__foot">
          <button className="adm-side__footbtn" onClick={onExit}>← View Site</button>
          <button className="adm-side__footbtn adm-side__footbtn--dim" onClick={onLogout}>Log out</button>
        </div>
      </aside>

      {/* ── main content ── */}
      <main className="adm-main">
        {view === 'dashboard'  && <DashboardView  setView={setView} />}
        {view === 'products'   && <ProductsView   />}
        {view === 'categories' && <CategoriesView />}
      </main>
    </div>
  );
}

/* ════════════════════════════════════════════
   DASHBOARD VIEW
════════════════════════════════════════════ */
function DashboardView({ setView }) {
  const { cats, prods, customProds } = useStore();

  const stats = [
    { label: 'Total Products',   value: prods.length      },
    { label: 'Custom Products',  value: customProds.length },
    { label: 'Categories',       value: cats.length        },
  ];

  const recent = [...customProds]
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 5);

  return (
    <div className="adm-view">
      <div className="adm-view__head">
        <h1 className="adm-view__title">Dashboard</h1>
        <p className="adm-view__sub">Overview of your store.</p>
      </div>

      {/* stats */}
      <div className="adm-stats">
        {stats.map(s => (
          <div key={s.label} className="adm-stat">
            <span className="adm-stat__val">{s.value}</span>
            <span className="adm-stat__lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {/* category breakdown */}
      <div className="adm-view__section">
        <h2 className="adm-view__h2">Products by Category</h2>
        <div className="adm-cat-bars">
          {cats.map(c => {
            const count = prods.filter(p => p.category === c.id).length;
            const pct   = prods.length ? Math.round((count / prods.length) * 100) : 0;
            return (
              <div key={c.id} className="adm-cat-bar">
                <div className="adm-cat-bar__info">
                  <span className="adm-cat-bar__name">{c.label}</span>
                  <span className="adm-cat-bar__count">{count}</span>
                </div>
                <div className="adm-cat-bar__track">
                  <div className="adm-cat-bar__fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* recent additions */}
      {recent.length > 0 && (
        <div className="adm-view__section">
          <h2 className="adm-view__h2">Recently Added</h2>
          <div className="adm-recent">
            {recent.map(p => (
              <div key={p.uid} className="adm-recent__row">
                <div className="adm-recent__img">
                  {p.image
                    ? <img src={p.image} alt={p.name} />
                    : <span>—</span>
                  }
                </div>
                <div className="adm-recent__info">
                  <span className="adm-recent__name">{p.name}</span>
                  <span className="adm-recent__cat">{p.category}</span>
                </div>
                <span className="adm-recent__price">{p.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {recent.length === 0 && (
        <div className="adm-empty">
          <p>No custom products yet.</p>
          <button className="adm-btn" onClick={() => setView('products')}>Add your first product →</button>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   PRODUCTS VIEW
════════════════════════════════════════════ */
function ProductsView() {
  const { cats, prods, addProd, updateProd, deleteProd } = useStore();

  const [filterCat, setFilterCat] = useState('all');
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing,   setEditing]   = useState(null);   // uid or null (null = add new)
  const [form,      setForm]      = useState(BLANK_FORM);
  const [imgMode,   setImgMode]   = useState('url');  // 'url' | 'file'
  const [hoverMode, setHoverMode] = useState('url');
  const [saving,    setSaving]    = useState(false);
  const [confirm,   setConfirm]   = useState(null);   // uid to confirm-delete

  const fileRef      = useRef();
  const hoverFileRef = useRef();

  const filtered = filterCat === 'all' ? prods : prods.filter(p => p.category === filterCat);

  /* ── open panel ── */
  const openAdd = () => {
    setEditing(null);
    setForm({ ...BLANK_FORM, category: cats[0]?.id || 'top' });
    setImgMode('url');
    setHoverMode('url');
    setPanelOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p.uid);
    setForm({
      name: p.name || '', price: p.price || '', category: p.category || 'top',
      description: p.description || '', image: p.image || '',
      imageHover: p.imageHover || '', sizes: p.sizes || ['S','M','L'],
      status: p.status || 'available',
    });
    setImgMode('url');
    setHoverMode('url');
    setPanelOpen(true);
  };

  const closePanel = () => { setPanelOpen(false); setEditing(null); };

  /* ── field helpers ── */
  const setF = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleSize = (sz) => setForm(f => ({
    ...f,
    sizes: f.sizes.includes(sz) ? f.sizes.filter(s => s !== sz) : [...f.sizes, sz],
  }));

  /* ── file → base64 ── */
  const handleFile = async (e, key) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 800_000) {
      alert('Image is large (>800 KB). Consider using a URL from Cloudinary or Unsplash instead for better performance.');
    }
    const reader = new FileReader();
    reader.onload = () => setF(key, reader.result);
    reader.readAsDataURL(file);
  };

  /* ── save ── */
  const save = () => {
    if (!form.name.trim() || !form.price.trim()) {
      alert('Name and price are required.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      if (editing) {
        updateProd(editing, form);
      } else {
        addProd(form);
      }
      setSaving(false);
      closePanel();
    }, 400);
  };

  /* ── delete ── */
  const confirmDelete = (uid) => setConfirm(uid);
  const doDelete = () => { deleteProd(confirm); setConfirm(null); };

  /* ── resolve image src for list ── */
  const thumbSrc = (p) => {
    if (p.image) return p.image;
    if (p.seeded) {
      if (p.category === 'bottom') return `/bottom/${p.id}.jpeg`;
      return `/top/${p.id}.jpeg`;
    }
    return null;
  };

  return (
    <div className="adm-view">
      {/* header row */}
      <div className="adm-view__head adm-view__head--row">
        <div>
          <h1 className="adm-view__title">Products</h1>
          <p className="adm-view__sub">{prods.length} total items across {cats.length} categories.</p>
        </div>
        <button className="adm-btn adm-btn--dark" onClick={openAdd}>+ Add Product</button>
      </div>

      {/* category filter */}
      <div className="adm-filters">
        <button className={`adm-filter ${filterCat==='all' ? 'adm-filter--on':''}`} onClick={() => setFilterCat('all')}>
          All ({prods.length})
        </button>
        {cats.map(c => (
          <button
            key={c.id}
            className={`adm-filter ${filterCat===c.id ? 'adm-filter--on':''}`}
            onClick={() => setFilterCat(c.id)}
          >
            {c.label} ({prods.filter(p => p.category === c.id).length})
          </button>
        ))}
      </div>

      {/* product table */}
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.uid} className="adm-table__row">
                <td>
                  <div className="adm-thumb">
                    {thumbSrc(p)
                      ? <img src={thumbSrc(p)} alt={p.name} />
                      : <span className="adm-thumb__empty">—</span>
                    }
                  </div>
                </td>
                <td className="adm-table__name">{p.name}</td>
                <td><span className="adm-badge">{p.category}</span></td>
                <td className="adm-table__price">{p.price}</td>
                <td>
                  <span className={`adm-status ${p.status === 'sold_out' ? 'adm-status--out' : 'adm-status--in'}`}>
                    {p.status === 'sold_out' ? 'Sold Out' : 'Available'}
                  </span>
                </td>
                <td>
                  <span className={`adm-type ${p.seeded ? 'adm-type--seed' : 'adm-type--custom'}`}>
                    {p.seeded ? 'Original' : 'Custom'}
                  </span>
                </td>
                <td className="adm-table__actions">
                  <button className="adm-action adm-action--edit" onClick={() => openEdit(p)}>Edit</button>
                  {!p.seeded && (
                    <button className="adm-action adm-action--del" onClick={() => confirmDelete(p.uid)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── SLIDE-IN FORM PANEL ── */}
      <div className={`adm-panel ${panelOpen ? 'adm-panel--open' : ''}`}>
        <div className="adm-panel__head">
          <h2 className="adm-panel__title">{editing ? 'Edit Product' : 'New Product'}</h2>
          <button className="adm-panel__close" onClick={closePanel}>✕</button>
        </div>

        <div className="adm-panel__body">
          {/* name */}
          <div className="adm-field">
            <label className="adm-label">Product Name *</label>
            <input className="adm-input" value={form.name} onChange={e => setF('name', e.target.value)} placeholder="e.g. Wool Blazer" />
          </div>

          {/* price + category row */}
          <div className="adm-row">
            <div className="adm-field">
              <label className="adm-label">Price *</label>
              <input className="adm-input" value={form.price} onChange={e => setF('price', e.target.value)} placeholder="$89" />
            </div>
            <div className="adm-field">
              <label className="adm-label">Category</label>
              <select className="adm-select" value={form.category} onChange={e => setF('category', e.target.value)}>
                {cats.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>

          {/* status */}
          <div className="adm-field">
            <label className="adm-label">Status</label>
            <select className="adm-select" value={form.status} onChange={e => setF('status', e.target.value)}>
              <option value="available">Available</option>
              <option value="sold_out">Sold Out</option>
            </select>
          </div>

          {/* description */}
          <div className="adm-field">
            <label className="adm-label">Description</label>
            <textarea className="adm-textarea" rows={3} value={form.description} onChange={e => setF('description', e.target.value)} placeholder="Describe the piece..." />
          </div>

          {/* sizes */}
          <div className="adm-field">
            <label className="adm-label">Available Sizes</label>
            <div className="adm-sizes">
              {SIZES.map(sz => (
                <button
                  key={sz}
                  type="button"
                  className={`adm-size ${form.sizes.includes(sz) ? 'adm-size--on' : ''}`}
                  onClick={() => toggleSize(sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* primary image */}
          <div className="adm-field">
            <label className="adm-label">Primary Image</label>
            <div className="adm-img-toggle">
              <button className={`adm-toggle-btn ${imgMode==='url'?'adm-toggle-btn--on':''}`} onClick={() => setImgMode('url')}>URL</button>
              <button className={`adm-toggle-btn ${imgMode==='file'?'adm-toggle-btn--on':''}`} onClick={() => setImgMode('file')}>Upload</button>
            </div>
            {imgMode === 'url'
              ? <input className="adm-input" value={form.image} onChange={e => setF('image', e.target.value)} placeholder="https://... or /assets/..." />
              : <div className="adm-file-wrap">
                  <input ref={fileRef} type="file" accept="image/*" className="adm-file-input" onChange={e => handleFile(e, 'image')} />
                  <button className="adm-file-btn" onClick={() => fileRef.current?.click()}>Choose File</button>
                  {form.image && <span className="adm-file-ok">✓ Image loaded</span>}
                </div>
            }
            {form.image && <img src={form.image} alt="" className="adm-preview" />}
          </div>

          {/* hover image */}
          <div className="adm-field">
            <label className="adm-label">Hover / Worn Image <span className="adm-optional">(optional)</span></label>
            <div className="adm-img-toggle">
              <button className={`adm-toggle-btn ${hoverMode==='url'?'adm-toggle-btn--on':''}`} onClick={() => setHoverMode('url')}>URL</button>
              <button className={`adm-toggle-btn ${hoverMode==='file'?'adm-toggle-btn--on':''}`} onClick={() => setHoverMode('file')}>Upload</button>
            </div>
            {hoverMode === 'url'
              ? <input className="adm-input" value={form.imageHover} onChange={e => setF('imageHover', e.target.value)} placeholder="https://... or /assets/..." />
              : <div className="adm-file-wrap">
                  <input ref={hoverFileRef} type="file" accept="image/*" className="adm-file-input" onChange={e => handleFile(e, 'imageHover')} />
                  <button className="adm-file-btn" onClick={() => hoverFileRef.current?.click()}>Choose File</button>
                  {form.imageHover && <span className="adm-file-ok">✓ Image loaded</span>}
                </div>
            }
            {form.imageHover && <img src={form.imageHover} alt="" className="adm-preview" />}
          </div>
        </div>

        <div className="adm-panel__foot">
          <button className="adm-btn adm-btn--ghost" onClick={closePanel}>Cancel</button>
          <button className="adm-btn adm-btn--dark" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : (editing ? 'Save Changes' : 'Add Product')}
          </button>
        </div>
      </div>

      {/* panel overlay */}
      {panelOpen && <div className="adm-overlay" onClick={closePanel} />}

      {/* ── DELETE CONFIRM MODAL ── */}
      {confirm && (
        <div className="adm-modal-wrap">
          <div className="adm-modal">
            <h3 className="adm-modal__title">Delete product?</h3>
            <p className="adm-modal__body">This cannot be undone.</p>
            <div className="adm-modal__actions">
              <button className="adm-btn adm-btn--ghost" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="adm-btn adm-btn--danger" onClick={doDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   CATEGORIES VIEW
════════════════════════════════════════════ */
function CategoriesView() {
  const { cats, prods, addCat, deleteCat } = useStore();
  const [input,   setInput]   = useState('');
  const [err,     setErr]     = useState('');
  const [confirm, setConfirm] = useState(null);

  const handleAdd = () => {
    if (!input.trim()) { setErr('Category name cannot be empty.'); return; }
    const ok = addCat(input.trim());
    if (!ok) { setErr('That category already exists.'); return; }
    setInput('');
    setErr('');
  };

  const handleDelete = (id) => setConfirm(id);
  const doDelete = () => { deleteCat(confirm); setConfirm(null); };

  return (
    <div className="adm-view">
      <div className="adm-view__head">
        <h1 className="adm-view__title">Categories</h1>
        <p className="adm-view__sub">Manage product categories. The original Top & Bottom categories cannot be deleted.</p>
      </div>

      {/* add new */}
      <div className="adm-view__section">
        <h2 className="adm-view__h2">Add New Category</h2>
        <div className="adm-cat-form">
          <input
            className="adm-input"
            value={input}
            onChange={e => { setInput(e.target.value); setErr(''); }}
            placeholder="e.g. Accessories, Outerwear, Footwear…"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button className="adm-btn adm-btn--dark" onClick={handleAdd}>Add Category</button>
        </div>
        {err && <p className="adm-err">{err}</p>}
      </div>

      {/* categories list */}
      <div className="adm-view__section">
        <h2 className="adm-view__h2">All Categories</h2>
        <div className="adm-cat-list">
          {cats.map(c => {
            const count = prods.filter(p => p.category === c.id).length;
            return (
              <div key={c.id} className="adm-cat-item">
                <div className="adm-cat-item__left">
                  <span className="adm-cat-item__name">{c.label}</span>
                  {c.seeded && <span className="adm-badge adm-badge--seed">Original</span>}
                  {!c.seeded && <span className="adm-badge adm-badge--custom">Custom</span>}
                </div>
                <div className="adm-cat-item__right">
                  <span className="adm-cat-item__count">{count} product{count !== 1 ? 's' : ''}</span>
                  {!c.seeded && (
                    <button className="adm-action adm-action--del" onClick={() => handleDelete(c.id)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DELETE CONFIRM */}
      {confirm && (
        <div className="adm-modal-wrap">
          <div className="adm-modal">
            <h3 className="adm-modal__title">Delete category?</h3>
            <p className="adm-modal__body">All products in this category will also be deleted. This cannot be undone.</p>
            <div className="adm-modal__actions">
              <button className="adm-btn adm-btn--ghost" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="adm-btn adm-btn--danger" onClick={doDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}