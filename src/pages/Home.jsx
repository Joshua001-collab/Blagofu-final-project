import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { HeroSection } from '../sections/Hero';
import { ProductsSection } from '../sections/Products';
import { ReviewsSection } from '../sections/Reviews';
import { ContactSection } from '../sections/Contact';

export default function Home() {
  const [settings, setSettings] = useState(null);
  const [hero, setHero] = useState(null);

  useEffect(() => {
    api.getSettings().then(data => {
      setSettings(data);
      if (data?.theme === 'light') {
        document.body.classList.add('light-mode');
      } else {
        document.body.classList.remove('light-mode');
      }
    }).catch(() => {});
    api.getHero().then(data => setHero(data)).catch(() => {});
  }, []);

  return (
    <div>
      {hero?.image && (
        <img src={hero.image} alt="background" className="page-bg" />
      )}
      <div className="bg-overlay" />
      <main>
        <HeroSection settings={settings} />
        <ProductsSection settings={settings} />
        <ReviewsSection />
        <ContactSection />
      </main>
      <footer className="footer">
        <div className="container">
          © {new Date().getFullYear()} {settings?.siteTitle || 'BLAGOFU.K'}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
