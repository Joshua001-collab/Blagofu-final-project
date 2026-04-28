import React, { useEffect, useState } from 'react';
import { api, MEDIA_URL } from '../api';

export function ProductsSection({ settings }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.getProducts().then(data => setProducts(data)).catch(() => {});
  }, []);

  const whatsappNumber = settings?.whatsappNumber || '';

  return (
    <section id="products" className="section">
      <div className="container">
        <h2 className="section-title">Our Collection</h2>
        <p className="section-subtitle">Discover our latest fashion pieces</p>
        
        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👗</div>
            <p>No products available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                {product.image && (
  <img 
    src={`data:${product.contentType};base64,${product.image}`}
    alt={product.name} 
    className="product-image"
    loading="lazy"
  />
)}
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  {product.description && (
                    <p className="product-desc">{product.description}</p>
                  )}
                  {product.price && (
                    <p className="product-price">₦{product.price}</p>
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
