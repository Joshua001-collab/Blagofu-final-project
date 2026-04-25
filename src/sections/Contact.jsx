import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Modal } from '../components/Modal';

export function ContactSection() {
  const [contacts, setContacts] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [modal, setModal] = useState({ open: false, title: '', text: '' });

  useEffect(() => {
    api.getContacts().then(data => setContacts(data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      setModal({ open: true, title: 'Missing Fields', text: 'Please fill in all fields.' });
      return;
    }
    try {
      await api.createMessage(form);
      setModal({ open: true, title: 'Message Sent', text: 'Thank you! We will get back to you soon.' });
      setForm({ name: '', phone: '', message: '' });
    } catch (err) {
      setModal({ open: true, title: 'Error', text: 'Failed to send message. Please try again.' });
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <p className="section-subtitle">We would love to hear from you</p>
        
        <div className="contact-grid">
          <div>
            {contacts?.phone && (
              <div className="contact-info-item">
                <div className="contact-icon">📞</div>
                <div>
                  <div className="contact-label">Phone</div>
                  <div className="contact-value">{contacts.phone}</div>
                </div>
              </div>
            )}
            {contacts?.email && (
              <div className="contact-info-item">
                <div className="contact-icon">✉️</div>
                <div>
                  <div className="contact-label">Email</div>
                  <div className="contact-value">{contacts.email}</div>
                </div>
              </div>
            )}
            {contacts?.address && (
              <div className="contact-info-item">
                <div className="contact-icon">📍</div>
                <div>
                  <div className="contact-label">Address</div>
                  <div className="contact-value">{contacts.address}</div>
                </div>
              </div>
            )}
            {contacts?.socialLinks?.instagram && (
              <div className="contact-info-item">
                <div className="contact-icon">📷</div>
                <div>
                  <div className="contact-label">Instagram</div>
                  <div className="contact-value">{contacts.socialLinks.instagram}</div>
                </div>
              </div>
            )}
          </div>
          
          <form className="contact-form glass-card" onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label className="admin-form-label">Your Name</label>
              <input
                className="glass-input"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Phone Number</label>
              <input
                className="glass-input"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Message</label>
              <textarea
                className="glass-input"
                rows="4"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help you?"
              />
            </div>
            <button type="submit" className="glass-btn glass-btn-primary" style={{ width: '100%' }}>
              Send Message
            </button>
          </form>
        </div>
      </div>
      
      <Modal
        open={modal.open}
        title={modal.title}
        onConfirm={() => setModal({ ...modal, open: false })}
        onCancel={() => setModal({ ...modal, open: false })}
        confirmText="OK"
        hideCancel
      >
        {modal.text}
      </Modal>
    </section>
  );
}
