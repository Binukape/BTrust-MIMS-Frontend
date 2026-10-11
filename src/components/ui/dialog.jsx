import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './button.jsx';
import { cn } from '../../lib/utils.js';

const EXIT_MS = 260;

export function Dialog({ open, onClose, title, children, footer }) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);

  const last = useRef({ title, children, footer });
  if (open) last.current = { title, children, footer };

  useEffect(() => {
    if (open) {
      setMounted(true);
      const timer = setTimeout(() => setShown(true), 30);
      return () => clearTimeout(timer);
    }
    setShown(false);
    const timer = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!mounted) return null;
  const content = last.current;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm transition-opacity duration-[260ms] ease-out',
        shown ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={content.title}
    >
      <div
        className={cn(
          'max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-canvas/[0.97] shadow-modal transition-[opacity,transform] duration-[320ms] ease-[cubic-bezier(0.2,0.7,0.2,1)]',
          shown ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-[0.96] opacity-0',
        )}
      >
        <div className="flex items-center justify-between px-6 pt-6">
          <h3 className="font-display text-[24px] font-medium leading-[1.17] text-ice">{content.title}</h3>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X size={18} />
          </Button>
        </div>
        <div className="px-6 py-5">{content.children}</div>
        {content.footer && <div className="flex justify-end gap-3 border-t border-mint px-6 py-4">{content.footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, title, children, confirmLabel = 'Confirm', destructive, busy, onConfirm, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant={destructive ? 'destructive' : 'default'} onClick={onConfirm} disabled={busy}>
            {busy ? 'Working...' : confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Dialog>
  );
}
