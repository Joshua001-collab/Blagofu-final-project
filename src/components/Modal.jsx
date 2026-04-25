import React from 'react';

export function Modal({ open, title, children, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', hideCancel = false }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {title && <h3 className="modal-title">{title}</h3>}
        {children && <div className="modal-text">{children}</div>}
        <div className="modal-actions">
          {!hideCancel && (
            <button className="glass-btn" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button className="glass-btn glass-btn-primary" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
