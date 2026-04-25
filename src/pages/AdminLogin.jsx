import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Modal } from '../components/Modal';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, text: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login(username, password);
      if (res.success) {
        localStorage.setItem('blagofuk_admin', JSON.stringify(res.user));
        navigate('/admin');
      } else {
        setModal({ open: true, text: 'Invalid username or password' });
      }
    } catch (err) {
      setModal({ open: true, text: err.message || 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Admin Login</h1>
        <p className="login-subtitle">BLAGOFU.K Dashboard</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">Username</label>
            <input
              className="glass-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Password</label>
            <input
              className="glass-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button 
            type="submit" 
            className="glass-btn glass-btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>

      <Modal
        open={modal.open}
        title="Login Error"
        onConfirm={() => setModal({ ...modal, open: false })}
        onCancel={() => setModal({ ...modal, open: false })}
        confirmText="OK"
        hideCancel
      >
        {modal.text}
      </Modal>
    </div>
  );
}
