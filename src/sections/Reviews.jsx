import React, { useEffect, useState } from 'react';
import { api } from '../api';

export function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    api.getReviews().then(data => setReviews(data)).catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    const el = document.getElementById('reviews');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="section reviews-section">
      <div className="reviews-bg-text">REVIEWS</div>
      <div className="container">
        <div className={`section-header ${visible ? 'section-visible' : ''}`}>
          <div className="section-eyebrow">Testimonials</div>
          <h2 className="section-title">What They Say</h2>
          <div className="section-title-bar" />
          <p className="section-subtitle">Real stories from our valued customers</p>
        </div>

        <div className="reviews-grid">
          {reviews.map((review, i) => (
            <div
              key={review._id || review.id}
              className={`review-card ${visible ? 'review-visible' : ''}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="review-quote-mark">"</div>
              {review.image && (
                <img
                  src={`data:${review.contentType};base64,${review.image}`}
                  alt={review.name}
                  className="review-avatar"
                />
              )}
              <div className="review-stars">
                {Array.from({ length: 5 }, (_, idx) => (
                  <span key={idx} className={idx < (review.rating || 5) ? 'star-filled' : 'star-empty'}>
                    ★
                  </span>
                ))}
              </div>
              <p className="review-text">{review.text}</p>
              <div className="review-footer">
                <div className="review-author">{review.name}</div>
                {review.role && <div className="review-role">{review.role}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}