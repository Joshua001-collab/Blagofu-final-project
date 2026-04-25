import React, { useEffect, useState } from 'react';
import { api, MEDIA_URL } from '../api';

export function ReviewsSection() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.getReviews().then(data => setReviews(data)).catch(() => {});
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="section">
      <div className="container">
        <h2 className="section-title">Customer Reviews</h2>
        <p className="section-subtitle">What our customers say about us</p>
        <div className="reviews-grid">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
  {review.image && (
    <img
      src={review.image?.startsWith('http') ? review.image : `${MEDIA_URL}${review.image} `}
      alt={review.name}
      style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', display: 'block', margin: '0 auto 16px auto', border: '3px solid var(--primary)' }}
    />
  )}
  <div className="review-stars">{'★'.repeat(review.rating || 5)}{'☆'.repeat(5 - (review.rating || 5))}</div>
  <p className="review-text">"{review.text}"</p>
  <div className="review-author">{review.name}</div>
  {review.role && <div className="review-role">{review.role}</div>}
</div>
          ))}
        </div>
      </div>
    </section>
  );
}
