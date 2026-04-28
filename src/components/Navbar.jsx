import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Navbar({ theme, settings }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isAdmin) return null;

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${mobileOpen ? 'navbar-mobile-open' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          {settings?.siteTitle || 'BLAGOFU.K'}
        </Link>

        <ul className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          <li><a href="#home" onClick={() => setMobileOpen(false)}>Home</a></li>
          <li><a href="#products" onClick={() => setMobileOpen(false)}>Collection</a></li>
          <li><a href="#reviews" onClick={() => setMobileOpen(false)}>Reviews</a></li>
          <li><a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a></li>
        </ul>

        <button
          className={`nav-toggle ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}