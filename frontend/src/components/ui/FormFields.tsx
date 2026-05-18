import React from 'react';

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
    )}
    <div className="relative group">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
          {icon}
        </span>
      )}
      <input
        className={`
          w-full h-10 rounded-xl border text-sm text-foreground placeholder-muted-foreground/50
          bg-card/50 backdrop-blur-sm border-border-theme px-3
          focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
          focus:bg-card
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${icon ? 'pl-9' : ''}
          ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}
          ${className}
        `}
        {...props}
      />
    </div>
    {error && <span className="text-xs text-danger font-medium">{error}</span>}
  </div>
);

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder,
  className = '',
  ...props
}) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
    )}
    <select
      className={`
        w-full h-10 rounded-xl border text-sm text-foreground
        bg-card/50 backdrop-blur-sm border-border-theme px-3
        focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
        focus:bg-card
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${error ? 'border-danger' : ''}
        ${className}
      `}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
    {error && <span className="text-xs text-danger font-medium">{error}</span>}
  </div>
);

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
    )}
    <textarea
      className={`
        w-full rounded-xl border text-sm text-foreground placeholder-muted-foreground/50
        bg-card/50 backdrop-blur-sm border-border-theme px-3 py-2.5 resize-none
        focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
        focus:bg-card
        transition-all duration-200
        ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}
        ${className}
      `}
      rows={3}
      {...props}
    />
    {error && <span className="text-xs text-danger font-medium">{error}</span>}
  </div>
);
