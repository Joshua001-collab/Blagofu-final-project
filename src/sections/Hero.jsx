import React, { useEffect, useState } from 'react';
import { api } from '../api';

export function HeroSection({ settings }) {
  const [hero, setHero] = useState(null);

  useEffect(() => {
    api.getHero().then(data => setHero(data)).catch(() => {});
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1 className="hero-title" style={{ color: settings?.heroTextColor || '#fff' }}>
          {hero?.title || 'BLAGOFU.K'}
        </h1>
        <p className="hero-subtitle">
          {hero?.subtitle || 'Premium Nigerian Fashion. Elegance redefined.'}
        </p>
        <a href="#products" className="glass-btn glass-btn-primary">
          Explore Collection
        </a>
      </div>
    </section>
  );
}
