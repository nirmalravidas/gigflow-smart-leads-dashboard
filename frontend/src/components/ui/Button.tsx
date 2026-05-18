import React from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:   'bg-primary hover:bg-primary-hover text-white shadow-glow border border-transparent',
  secondary: 'bg-card hover:bg-card-alt text-foreground border border-border-theme',
  danger:    'bg-danger/10 hover:bg-danger/20 text-danger border border-danger/30',
  ghost:     'bg-transparent hover:bg-card-alt text-muted-foreground hover:text-foreground border border-transparent',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-base gap-2 rounded-xl',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  ...props
}) => (
  <button
    disabled={disabled || loading}
    className={`
      inline-flex items-center justify-center font-medium
      transition-all duration-200 cursor-pointer select-none
      disabled:opacity-50 disabled:cursor-not-allowed
      hover:-translate-y-px active:translate-y-0
      ${variantStyles[variant]} ${sizeStyles[size]} ${className}
    `}
    {...props}
  >
    {loading ? <Loader2 className="animate-spin" size={16} /> : icon}
    {children}
  </button>
);
