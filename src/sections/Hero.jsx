import React, { useEffect, useState } from 'react';
import { api } from '../api';

export function HeroSection({ settings }) {
  const [hero, setHero] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.getHero().then(data => setHero(data)).catch(() => {});
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="home" className="hero">
      <div className={`hero-content ${loaded ? 'hero-loaded' : ''}`}>
        <div className="hero-eyebrow">Nigerian Fashion House</div>
        <h1 className="hero-title" style={{ color: settings?.heroTextColor || '#fff' }}>
          {hero?.title || 'BLAGOFU.K'}
        </h1>
        <div className="hero-divider">
          <span className="hero-divider-line" />
          <span className="hero-divider-diamond">◆</span>
          <span className="hero-divider-line" />
        </div>
        <p className="hero-subtitle">
          {hero?.subtitle || 'Premium Nigerian Fashion. Elegance redefined.'}
        </p>
        <div className="hero-cta-group">
          <a href="#products" className="hero-cta-primary">
            Explore Collection
          </a>
          <a href="#contact" className="hero-cta-secondary">
            Get in Touch
          </a>
        </div>
        <div className="hero-scroll-hint">
          <span>Scroll</span>
          <div className="hero-scroll-line" />
        </div>
      </div>
    </section>
  );
}