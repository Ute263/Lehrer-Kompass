import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: ReactNode;
}

export function Button({ variant = "primary", loading = false, disabled, children, className = "", ...props }: ButtonProps) {
  return <button className={`button button--${variant} ${className}`} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
    {loading && <LoaderCircle aria-hidden="true" className="button__spinner" size={18} />}
    <span>{children}</span>
  </button>;
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { label: string; children: ReactNode; }
export function IconButton({ label, children, className = "", ...props }: IconButtonProps) {
  return <button className={`icon-button ${className}`} aria-label={label} title={label} {...props}>{children}</button>;
}

export function Tooltip({ text, children }: { text: string; children: ReactNode }) {
  return <span className="tooltip"><span aria-describedby={`tip-${text.replaceAll(" ", "-")}`}>{children}</span><span role="tooltip" id={`tip-${text.replaceAll(" ", "-")}`} className="tooltip__bubble">{text}</span></span>;
}
