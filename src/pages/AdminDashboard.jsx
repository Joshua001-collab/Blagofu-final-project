import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Modal } from '../components/Modal';

const TABS = [
  { id: 'hero', label: 'Hero Section', icon: '🏠' },
  { id: 'products', label: 'Products', icon: '👗' },
  { id: 'reviews', label: 'Reviews', icon: '⭐' },
  { id: 'messages', label: 'Messages', icon: '💬' },
  { id: 'contacts', label: 'Contact Info', icon: '📞' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('hero');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState({
    hero: null,
    products: [],
    reviews: [],
    messages: [],
    contacts: null,
    settings: null,
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, title: '', text: '', onConfirm: null });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [editingHero, setEditingHero] = useState(false);
  const [editingContacts, setEditingContacts] = useState(false);
  const [editingSettings, setEditingSettings] = useState(false);
  const [pwModal, setPwModal] = useState(false);
  const [pwData, setPwData] = useState({ current: '', new: '', confirm: '' });
  const navigate = useNavigate();

  const isAuth = !!localStorage.getItem('blagofuk_admin');

  useEffect(() => {
    if (!isAuth) navigate('/admin/login');
  }, [isAuth, navigate]);

  const loadAll = useCallback(async () => {
    try {
      const [hero, products, reviews, messages, contacts, settings] = await Promise.all([
        api.getHero(),
        api.getProducts(),
        api.getReviews(),
        api.getMessages(),
        api.getContacts(),
        api.getSettings(),
      ]);
      setData({ hero, products, reviews, messages, contacts, settings });
    } catch (err) {
      console.error('Load error:', err);
    }
  }, []);

  useEffect(() => {
    if (isAuth) loadAll();
  }, [isAuth, loadAll]);

  const logout = () => {
    localStorage.removeItem('blagofuk_admin');
    navigate('/');
  };

  const showAlert = (title, text, onConfirm) => {
    setModal({ open: true, title, text, onConfirm: onConfirm || (() => setModal(m => ({ ...m, open: false }))) });
  };

  const confirmDelete = (title, onConfirm) => {
    setModal({
      open: true,
      title: 'Confirm Delete',
      text: title,
      onConfirm: () => {
        onConfirm();
        setModal(m => ({ ...m, open: false }));
      }
    });
  };

  // ===== HERO HANDLERS =====
  const saveHero = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();
    formData.append('title', form.title.value);
    formData.append('subtitle', form.subtitle.value);
    if (form.image.files[0]) formData.append('image', form.image.files[0]);
    try {
      setLoading(true);
      await api.updateHero(formData);
      const hero = await api.getHero();
      setData(d => ({ ...d, hero }));
      setEditingHero(false);
      showAlert('Success', 'Hero section updated!');
    } catch (err) {
      showAlert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== PRODUCT HANDLERS =====
  const saveProduct = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();
    formData.append('name', form.name.value);
    formData.append('price', form.price.value);
    formData.append('description', form.description.value);
    if (form.image.files[0]) formData.append('image', form.image.files[0]);
    try {
      setLoading(true);
      if (editingProduct && editingProduct.id) {
  await api.updateProduct(editingProduct.id, formData);
} else {
  await api.createProduct(formData);
}
      const products = await api.getProducts();
      setData(d => ({ ...d, products }));
      setEditingProduct(null);
      showAlert('Success', editingProduct ? 'Product updated!' : 'Product added!');
    } catch (err) {
      showAlert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = (id) => {
    confirmDelete('Delete this product?', async () => {
      await api.deleteProduct(id);
      const products = await api.getProducts();
      setData(d => ({ ...d, products }));
    });
  };

  // ===== REVIEW HANDLERS =====
const saveReview = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();
    formData.append('name', form.name.value);
    formData.append('text', form.text.value);
    formData.append('rating', parseInt(form.rating.value));
    formData.append('role', form.role.value);
    if (form.image.files[0]) formData.append('image', form.image.files[0]);
    try {
      setLoading(true);
      if (editingReview && editingReview.id) {
        await api.updateReview(editingReview.id, formData);
      } else {
        await api.createReview(formData);
      }
      const reviews = await api.getReviews();
      setData(d => ({ ...d, reviews }));
      setEditingReview(null);
      showAlert('Success', editingReview ? 'Review updated!' : 'Review added!');
    } catch (err) {
      showAlert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = (id) => {
    confirmDelete('Delete this review?', async () => {
      await api.deleteReview(id);
      const reviews = await api.getReviews();
      setData(d => ({ ...d, reviews }));
    });
  };

  // ===== MESSAGE HANDLERS =====
  const deleteMessage = (id) => {
    confirmDelete('Delete this message?', async () => {
      await api.deleteMessage(id);
      const messages = await api.getMessages();
      setData(d => ({ ...d, messages }));
    });
  };

  const markRead = async (id) => {
    await api.markMessageRead(id);
    const messages = await api.getMessages();
    setData(d => ({ ...d, messages }));
  };

  // ===== CONTACT HANDLERS =====
  const saveContacts = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      phone: form.phone.value,
      email: form.email.value,
      address: form.address.value,
      socialLinks: {
        instagram: form.instagram.value,
        facebook: form.facebook.value,
        twitter: form.twitter.value,
      }
    };
    try {
      setLoading(true);
      await api.updateContacts(payload);
      const contacts = await api.getContacts();
      setData(d => ({ ...d, contacts }));
      setEditingContacts(false);
      showAlert('Success', 'Contact info updated!');
    } catch (err) {
      showAlert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== SETTINGS HANDLERS =====
  const saveSettings = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      siteTitle: form.siteTitle.value,
      whatsappNumber: form.whatsappNumber.value,
      theme: form.theme.value,
      heroTextColor: form.heroTextColor.value,
      primaryColor: form.primaryColor.value,
    };
    try {
      setLoading(true);
      await api.updateSettings(payload);
      const settings = await api.getSettings();
      setData(d => ({ ...d, settings }));
      if (settings.theme === 'light') {
        document.body.classList.add('light-mode');
      } else {
        document.body.classList.remove('light-mode');
      }
      setEditingSettings(false);
      showAlert('Success', 'Settings saved!');
    } catch (err) {
      showAlert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== PASSWORD =====
  const changePassword = async (e) => {
    e.preventDefault();
    if (pwData.new !== pwData.confirm) {
      showAlert('Error', 'New passwords do not match');
      return;
    }
    try {
      await api.changePassword(pwData.current, pwData.new);
      setPwModal(false);
      showAlert('Success', 'Password changed!');
      setPwData({ current: '', new: '', confirm: '' });
    } catch (err) {
      showAlert('Error', err.message);
    }
  };

  if (!isAuth) return null;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-title">BLAGOFU.K</div>
          <div className="admin-sidebar-subtitle">Admin Dashboard</div>
        </div>
        <ul className="admin-nav">
          {TABS.map(tab => (
            <li key={tab.id} className="admin-nav-item">
              <button
                className={`admin-nav-link ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            </li>
          ))}
          <li className="admin-nav-item" style={{ marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
            <button className="admin-nav-link" onClick={() => setPwModal(true)}>
              <span>🔐</span> Change Password
            </button>
          </li>
          <li className="admin-nav-item">
            <button className="admin-nav-link" onClick={logout}>
              <span>🚪</span> Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 101,
          background: 'var(--glass-bg-solid)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          padding: '10px 14px',
          color: 'var(--text-primary)',
          fontSize: '1.2rem',
          cursor: 'pointer',
          display: window.innerWidth > 768 ? 'none' : 'block'
        }}
      >
        ☰
      </button>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-header-title">{TABS.find(t => t.id === activeTab)?.label}</h1>
        </div>

        {loading && <div className="loading-spinner" />}

        {/* ===== HERO TAB ===== */}
        {activeTab === 'hero' && (
          <div>
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 className="admin-card-title">Current Hero</h3>
                <button className="glass-btn glass-btn-primary" onClick={() => setEditingHero(!editingHero)}>
                  {editingHero ? 'Cancel' : 'Edit Hero'}
                </button>
              </div>
              {data.hero?.image && (
                <img src={data.hero.image} alt="Hero" className="admin-image-preview" style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }} />
              )}
              <div style={{ marginTop: '16px' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{data.hero?.title || 'No title'}</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>{data.hero?.subtitle || 'No subtitle'}</p>
              </div>
            </div>

            {editingHero && (
              <form className="admin-card" onSubmit={saveHero}>
                <h3 className="admin-card-title">Edit Hero Section</h3>
                <div className="admin-form-group">
                  <label className="admin-form-label">Title</label>
                  <input className="glass-input" name="title" defaultValue={data.hero?.title || ''} placeholder="Hero title" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Subtitle</label>
                  <input className="glass-input" name="subtitle" defaultValue={data.hero?.subtitle || ''} placeholder="Hero subtitle" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Hero Image</label>
                  <input className="glass-input" name="image" type="file" accept="image/*" />
                </div>
                <div className="modal-actions">
                  <button type="button" className="glass-btn" onClick={() => setEditingHero(false)}>Cancel</button>
                  <button type="submit" className="glass-btn glass-btn-primary">Save Hero</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ===== PRODUCTS TAB ===== */}
        {activeTab === 'products' && (
          <div>
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="admin-card-title">All Products</h3>
                <button className="glass-btn glass-btn-primary" onClick={() => setEditingProduct({})}>
                  + Add Product
                </button>
              </div>
            </div>

            {editingProduct !== null && (
              <form className="admin-card" onSubmit={saveProduct}>
                <h3 className="admin-card-title">{editingProduct.id ? 'Edit Product' : 'Add Product'}</h3>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Product Name</label>
                    <input className="glass-input" name="name" defaultValue={editingProduct.name || ''} placeholder="Product name" required />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Price (₦)</label>
                    <input className="glass-input" name="price" defaultValue={editingProduct.price || ''} placeholder="Leave empty to hide price & WhatsApp" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Description</label>
                  <textarea className="glass-input" name="description" rows="3" defaultValue={editingProduct.description || ''} placeholder="Product description" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Product Image</label>
                  <input className="glass-input" name="image" type="file" accept="image/*" />
                  {editingProduct.image && (
  <img
    src={`data:${editingProduct.contentType};base64,${editingProduct.image}`}
    className="admin-image-preview"
  />
)}
                </div>
                <div className="modal-actions">
                  <button type="button" className="glass-btn" onClick={() => setEditingProduct(null)}>Cancel</button>
                  <button type="submit" className="glass-btn glass-btn-primary">Save Product</button>
                </div>
              </form>
            )}

            <div className="admin-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                 {data.products.map(p => (
  <tr key={p._id || p.id}>
    <td>
      {p.image ? <img src={`data:${p.contentType};base64,${p.image}`} alt={p.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} /> : <span style={{ color: 'var(--text-muted)' }}>No image</span>}
    </td>
    <td>{p.name}</td>
    <td>{p.price ? `₦${p.price}` : <span style={{ color: 'var(--text-muted)' }}>-</span>}</td>
    <td>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="glass-btn" style={{ padding: '8px 14px', fontSize: '0.85rem' }} onClick={() => setEditingProduct(p)}>Edit</button>
        <button className="glass-btn glass-btn-danger" style={{ padding: '8px 14px', fontSize: '0.85rem' }} onClick={() => deleteProduct(p._id || p.id)}>Delete</button>
      </div>
    </td>
  </tr>
))}
                </tbody>
              </table>
              {data.products.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">📦</div>
                  <p>No products yet. Add your first product above.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== REVIEWS TAB ===== */}
        {activeTab === 'reviews' && (
          <div>
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="admin-card-title">All Reviews</h3>
                <button className="glass-btn glass-btn-primary" onClick={() => setEditingReview({})}>
                  + Add Review
                </button>
              </div>
            </div>

            {editingReview !== null && (
              <form className="admin-card" onSubmit={saveReview}>
                <h3 className="admin-card-title">{editingReview.id ? 'Edit Review' : 'Add Review'}</h3>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Customer Name</label>
                    <input className="glass-input" name="name" defaultValue={editingReview.name || ''} placeholder="Name" required />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Rating (1-5)</label>
                    <select className="glass-input" name="rating" defaultValue={editingReview.rating || 5}>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Review Text</label>
                  <textarea className="glass-input" name="text" rows="3" defaultValue={editingReview.text || ''} placeholder="Review text" required />
                </div>
              <div className="admin-form-group">
  <label className="admin-form-label">Role/Location (optional)</label>
  <input className="glass-input" name="role" defaultValue={editingReview.role || ''} placeholder="e.g. Lagos, Nigeria" />
</div>
<div className="admin-form-group">
  <label className="admin-form-label">Client Photo (optional)</label>
  <input className="glass-input" name="image" type="file" accept="image/*" />
  {editingReview.image && (
    <img src={editingReview.image} alt="preview" style={{ width: '60px', height: '60px', borderRadius: '50%', marginTop: '8px', objectFit: 'cover' }} />
  )}
</div>
                <div className="modal-actions">
                  <button type="button" className="glass-btn" onClick={() => setEditingReview(null)}>Cancel</button>
                  <button type="submit" className="glass-btn glass-btn-primary">Save Review</button>
                </div>
              </form>
            )}

            <div className="reviews-grid">
              {data.reviews.map(r => (
                <div key={r.id} className="review-card">
                  <div className="review-stars">{'★'.repeat(r.rating || 5)}{'☆'.repeat(5 - (r.rating || 5))}</div>
                  <p className="review-text">"{r.text}"</p>
                  <div className="review-author">{r.name}</div>
                  {r.role && <div className="review-role">{r.role}</div>}
                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                    <button className="glass-btn" style={{ padding: '8px 14px', fontSize: '0.85rem' }} onClick={() => setEditingReview(r)}>Edit</button>
                    <button className="glass-btn glass-btn-danger" style={{ padding: '8px 14px', fontSize: '0.85rem' }} onClick={() => deleteReview(r.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
            {data.reviews.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">⭐</div>
                <p>No reviews yet. Add your first review above.</p>
              </div>
            )}
          </div>
        )}

        {/* ===== MESSAGES TAB ===== */}
        {activeTab === 'messages' && (
          <div>
            <div className="admin-card">
              <h3 className="admin-card-title">Contact Messages ({data.messages.length})</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.messages.map(m => (
                    <tr key={m.id}>
                      <td>
                        <span className={`admin-badge ${m.read ? 'admin-badge-success' : 'admin-badge-unread'}`}>
                          {m.read ? 'Read' : 'New'}
                        </span>
                      </td>
                      <td>{m.name}</td>
                      <td>{m.phone}</td>
                      <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</td>
                      <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {!m.read && (
                            <button className="glass-btn" style={{ padding: '8px 14px', fontSize: '0.85rem' }} onClick={() => markRead(m.id)}>Mark Read</button>
                          )}
                          <button className="glass-btn glass-btn-danger" style={{ padding: '8px 14px', fontSize: '0.85rem' }} onClick={() => deleteMessage(m.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.messages.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <p>No messages yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== CONTACTS TAB ===== */}
        {activeTab === 'contacts' && (
          <div>
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="admin-card-title">Contact Information</h3>
                <button className="glass-btn glass-btn-primary" onClick={() => setEditingContacts(!editingContacts)}>
                  {editingContacts ? 'Cancel' : 'Edit Contacts'}
                </button>
              </div>
              <div style={{ marginTop: '16px' }}>
                <p><strong style={{ color: 'var(--text-muted)' }}>Phone:</strong> <span style={{ color: 'var(--text-primary)' }}>{data.contacts?.phone || '-'}</span></p>
                <p><strong style={{ color: 'var(--text-muted)' }}>Email:</strong> <span style={{ color: 'var(--text-primary)' }}>{data.contacts?.email || '-'}</span></p>
                <p><strong style={{ color: 'var(--text-muted)' }}>Address:</strong> <span style={{ color: 'var(--text-primary)' }}>{data.contacts?.address || '-'}</span></p>
                <p><strong style={{ color: 'var(--text-muted)' }}>Instagram:</strong> <span style={{ color: 'var(--text-primary)' }}>{data.contacts?.socialLinks?.instagram || '-'}</span></p>
                <p><strong style={{ color: 'var(--text-muted)' }}>Facebook:</strong> <span style={{ color: 'var(--text-primary)' }}>{data.contacts?.socialLinks?.facebook || '-'}</span></p>
                <p><strong style={{ color: 'var(--text-muted)' }}>Twitter:</strong> <span style={{ color: 'var(--text-primary)' }}>{data.contacts?.socialLinks?.twitter || '-'}</span></p>
              </div>
            </div>

            {editingContacts && (
              <form className="admin-card" onSubmit={saveContacts}>
                <h3 className="admin-card-title">Edit Contact Info</h3>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Phone</label>
                    <input className="glass-input" name="phone" defaultValue={data.contacts?.phone || ''} placeholder="Phone number" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Email</label>
                    <input className="glass-input" name="email" defaultValue={data.contacts?.email || ''} placeholder="Email address" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Address</label>
                  <textarea className="glass-input" name="address" rows="2" defaultValue={data.contacts?.address || ''} placeholder="Business address" />
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Instagram</label>
                    <input className="glass-input" name="instagram" defaultValue={data.contacts?.socialLinks?.instagram || ''} placeholder="@username" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Facebook</label>
                    <input className="glass-input" name="facebook" defaultValue={data.contacts?.socialLinks?.facebook || ''} placeholder="Facebook page" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Twitter</label>
                  <input className="glass-input" name="twitter" defaultValue={data.contacts?.socialLinks?.twitter || ''} placeholder="@username" />
                </div>
                <div className="modal-actions">
                  <button type="button" className="glass-btn" onClick={() => setEditingContacts(false)}>Cancel</button>
                  <button type="submit" className="glass-btn glass-btn-primary">Save Contacts</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ===== SETTINGS TAB ===== */}
        {activeTab === 'settings' && (
          <div>
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="admin-card-title">Website Settings</h3>
                <button className="glass-btn glass-btn-primary" onClick={() => setEditingSettings(!editingSettings)}>
                  {editingSettings ? 'Cancel' : 'Edit Settings'}
                </button>
              </div>
              <div style={{ marginTop: '16px' }}>
                <p><strong style={{ color: 'var(--text-muted)' }}>Site Title:</strong> <span style={{ color: 'var(--text-primary)' }}>{data.settings?.siteTitle || 'BLAGOFU.K'}</span></p>
                <p><strong style={{ color: 'var(--text-muted)' }}>WhatsApp:</strong> <span style={{ color: 'var(--text-primary)' }}>{data.settings?.whatsappNumber || '-'}</span></p>
                <p><strong style={{ color: 'var(--text-muted)' }}>Theme:</strong> <span style={{ color: 'var(--text-primary)' }}>{data.settings?.theme || 'dark'}</span></p>
                <p><strong style={{ color: 'var(--text-muted)' }}>Hero Text Color:</strong> <span style={{ color: data.settings?.heroTextColor || '#fff' }}>{data.settings?.heroTextColor || '#ffffff'}</span></p>
                <p><strong style={{ color: 'var(--text-muted)' }}>Primary Color:</strong> <span style={{ color: data.settings?.primaryColor || '#c9a96e' }}>{data.settings?.primaryColor || '#c9a96e'}</span></p>
              </div>
            </div>

            {editingSettings && (
              <form className="admin-card" onSubmit={saveSettings}>
                <h3 className="admin-card-title">Edit Settings</h3>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Site Title</label>
                    <input className="glass-input" name="siteTitle" defaultValue={data.settings?.siteTitle || 'BLAGOFU.K'} placeholder="Website title" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">WhatsApp Number</label>
                    <input className="glass-input" name="whatsappNumber" defaultValue={data.settings?.whatsappNumber || ''} placeholder="e.g. 2348012345678" />
                  </div>
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Theme</label>
                    <select className="glass-input" name="theme" defaultValue={data.settings?.theme || 'dark'}>
                      <option value="dark">Dark Mode</option>
                      <option value="light">Light Mode</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Hero Text Color</label>
                    <input className="glass-input" name="heroTextColor" type="color" defaultValue={data.settings?.heroTextColor || '#ffffff'} style={{ height: '50px', padding: '4px' }} />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Primary Accent Color</label>
                  <input className="glass-input" name="primaryColor" type="color" defaultValue={data.settings?.primaryColor || '#c9a96e'} style={{ height: '50px', padding: '4px' }} />
                </div>
                <div className="modal-actions">
                  <button type="button" className="glass-btn" onClick={() => setEditingSettings(false)}>Cancel</button>
                  <button type="submit" className="glass-btn glass-btn-primary">Save Settings</button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        open={modal.open}
        title={modal.title}
        onConfirm={modal.onConfirm}
        onCancel={() => setModal(m => ({ ...m, open: false }))}
        confirmText="OK"
        hideCancel={!modal.onConfirm || modal.title === 'Confirm Delete'}
      >
        {modal.text}
      </Modal>

      <Modal
        open={pwModal}
        title="Change Password"
        onConfirm={() => {}}
        onCancel={() => setPwModal(false)}
        confirmText=""
        hideCancel
      >
        <form onSubmit={changePassword}>
          <div className="admin-form-group">
            <label className="admin-form-label">Current Password</label>
            <input className="glass-input" type="password" value={pwData.current} onChange={e => setPwData({ ...pwData, current: e.target.value })} required />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">New Password</label>
            <input className="glass-input" type="password" value={pwData.new} onChange={e => setPwData({ ...pwData, new: e.target.value })} required />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Confirm New Password</label>
            <input className="glass-input" type="password" value={pwData.confirm} onChange={e => setPwData({ ...pwData, confirm: e.target.value })} required />
          </div>
          <div className="modal-actions">
            <button type="button" className="glass-btn" onClick={() => setPwModal(false)}>Cancel</button>
            <button type="submit" className="glass-btn glass-btn-primary">Change Password</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
