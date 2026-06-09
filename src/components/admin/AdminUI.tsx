'use client';

import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Modal ─────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        className="card w-full max-w-xl max-h-[90vh] overflow-y-auto"
        style={{ borderRadius: 20, padding: 32 }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display font-bold text-lg">{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-sm"
            style={{ background: 'var(--surface2)', color: 'var(--text2)' }}>✕</button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

// ─── Confirm dialog ────────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm mb-6" style={{ color: 'var(--text2)', lineHeight: 1.6 }}>{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn btn-outline text-sm px-5">Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }}
          className="btn btn-danger text-sm px-5">Delete</button>
      </div>
    </Modal>
  );
}

// ─── Form field wrapper ────────────────────────────────────────
export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="input-label">{label}</label>
      {children}
      {hint && <p className="font-mono text-xs" style={{ color: 'var(--text3)' }}>{hint}</p>}
    </div>
  );
}

// ─── Tags input ────────────────────────────────────────────────
export function TagsInput({ value, onChange, placeholder }: {
  value: string[]; onChange: (v: string[]) => void; placeholder?: string;
}) {
  const [input, setInput] = useState('');
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed]);
    setInput('');
  };
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map(tag => (
          <span key={tag} className="tag flex items-center gap-1.5">
            {tag}
            <button onClick={() => onChange(value.filter(t => t !== tag))}
              className="ml-0.5 text-xs opacity-60 hover:opacity-100" style={{ color: 'var(--accent)' }}>✕</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="input flex-1 text-sm" placeholder={placeholder ?? 'Add tag...'}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }} />
        <button onClick={add} className="btn btn-outline text-xs px-3">Add</button>
      </div>
    </div>
  );
}

// ─── Loading spinner ───────────────────────────────────────────
export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `2px solid var(--border)`,
      borderTop: `2px solid var(--accent)`,
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }} />
  );
}

// ─── Empty state ───────────────────────────────────────────────
export function EmptyState({ icon, title, desc, action }: {
  icon: string; title: string; desc: string; action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-display font-bold text-base mb-2">{title}</h3>
      <p className="text-sm mb-6" style={{ color: 'var(--text3)', maxWidth: 320, lineHeight: 1.6 }}>{desc}</p>
      {action}
    </div>
  );
}

// ─── Status toggle ─────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    live: 'badge-green', published: 'badge-green',
    draft: 'badge-gold', pending: 'badge-gold',
    approved: 'badge-green', archived: 'badge-blue',
    declined: 'badge-red', new: 'badge-gold',
    read: 'badge-blue', replied: 'badge-green',
  };
  return <span className={`badge ${map[status] ?? 'badge-blue'}`}>{status}</span>;
}

// ─── Color picker ─────────────────────────────────────────────
export const CERT_COLORS = [
  '#f5a623', '#00e5ff', '#00d68f', '#a855f7', '#ff4757',
  '#0ea5e9', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6',
];

export function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CERT_COLORS.map(c => (
        <button key={c} onClick={() => onChange(c)}
          style={{
            width: 28, height: 28, borderRadius: '50%', background: c,
            border: value === c ? `3px solid var(--text)` : '2px solid transparent',
            cursor: 'pointer', transition: 'transform 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        />
      ))}
    </div>
  );
}
