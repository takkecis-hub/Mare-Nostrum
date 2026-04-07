'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="modal-content card" role="dialog" aria-modal="true">
        {title && (
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="modal-close" onClick={onClose} aria-label="Kapat">✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
