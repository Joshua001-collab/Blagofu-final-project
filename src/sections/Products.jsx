import React, { useEffect, useState } from 'react';
import { api } from '../api';

export function ProductsSection({ settings }) {
  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    api.getProducts().then(data => setProducts(data)).catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    const el = document.getElementById('products');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const whatsappNumber = settings?.whatsappNumber || '';

  return (
    <section id="products" className="section products-section">
      <div className="container">
        <div className={`section-header ${visible ? 'section-visible' : ''}`}>
          <div className="section-eyebrow">The Collection</div>
          <h2 className="section-title">Our Latest Pieces</h2>
          <div className="section-title-bar" />
          <p className="section-subtitle">Handcrafted with passion. Worn with pride.</p>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👗</div>
            <p>No products available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product, i) => (
              <div
                key={product._id || product.id}
                className={`product-card ${visible ? 'product-visible' : ''}`}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className="product-image-wrap">
                  {product.image ? (
                    <img
                      src={`data:${product.contentType};base64,${product.image}`}
                      alt={product.name}
                      className="product-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="product-image-placeholder">
                      <span>👗</span>
                    </div>
                  )}
                  <div className="product-overlay">
                    {whatsappNumber && (
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=I'm%20interested%20in%20this%20product:%20${encodeURIComponent(product.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="product-quick-order"
                      >
                        💬 Quick Order
                      </a>
                    )}
                  </div>
                  {product.price && (
                    <div className="product-price-badge">₦{product.price}</div>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  {product.description && (
                    <p className="product-desc">{product.description}</p>
                  )}
                  <div className="product-footer">
                    {product.price && (
                      <span className="product-price">₦{product.price}</span>
                    )}
                    {whatsappNumber && (
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=I'm%20interested%20in%20this%20product:%20${encodeURIComponent(product.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="product-whatsapp"
                      >
                        💬 Order via WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}