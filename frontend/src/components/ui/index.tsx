import React from 'react';
import { X } from 'lucide-react';
import { LeadStatus, LeadSource } from '../../types';



const statusConfig: Record<LeadStatus, { label: string; color: string }> = {
  [LeadStatus.NEW]:       { label: 'New',       color: 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]' },
  [LeadStatus.CONTACTED]: { label: 'Contacted', color: 'bg-warning/10 text-warning border border-warning/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]' },
  [LeadStatus.QUALIFIED]: { label: 'Qualified', color: 'bg-success/10 text-success border border-success/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]' },
  [LeadStatus.LOST]:      { label: 'Lost',      color: 'bg-danger/10 text-danger border border-danger/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]' },
};

const sourceConfig: Record<LeadSource, { label: string; color: string }> = {
  [LeadSource.WEBSITE]:   { label: 'Website',   color: 'bg-card-alt text-muted-foreground border border-border-theme' },
  [LeadSource.INSTAGRAM]: { label: 'Instagram', color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
  [LeadSource.REFERRAL]:  { label: 'Referral',  color: 'bg-orange-500/10 text-orange-400 border border-orange-500/20' },
};

export const StatusBadge: React.FC<{ status: LeadStatus }> = ({ status }) => {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};

export const SourceBadge: React.FC<{ source: LeadSource }> = ({ source }) => {
  const cfg = sourceConfig[source];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};



export const Spinner: React.FC<{ size?: number; className?: string }> = ({
  size = 20,
  className = '',
}) => (
  <div
    className={`rounded-full border-2 border-border-theme border-t-primary animate-spin ${className}`}
    style={{ width: size, height: size }}
  />
);



export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center h-64">
    <Spinner size={32} />
  </div>
);



interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4">
    <div className="text-muted-foreground w-12 h-12 opacity-50">{icon}</div>
    <div className="text-center">
      <p className="text-foreground font-medium">{title}</p>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
    {action}
  </div>
);



interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, width = 'max-w-lg' }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`glass-panel rounded-2xl w-full ${width} animate-slide-up shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-theme">
          <h2 className="font-bold text-foreground text-lg tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-card-alt"
          >
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};



interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open, onClose, onConfirm, title, description, loading,
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="glass-panel rounded-2xl w-full max-w-sm animate-slide-up shadow-2xl border-danger/20">
        <div className="p-6">
          <h2 className="font-bold text-foreground text-lg tracking-tight mb-2">{title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          <div className="flex gap-3 mt-6 justify-end">
            <button
              onClick={onClose}
              className="px-4 h-10 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card-alt transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 h-10 rounded-xl text-sm font-medium bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
