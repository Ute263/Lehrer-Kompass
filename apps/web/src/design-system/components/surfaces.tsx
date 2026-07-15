import type { HTMLAttributes, ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, Lightbulb, TriangleAlert } from "lucide-react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={`card ${className}`} {...props} />;
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "info" | "success" | "warning"; children: ReactNode }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export type NoticeVariant = "info" | "suggestion" | "success" | "warning" | "error";
const noticeIcons = { info: Info, suggestion: Lightbulb, success: CircleCheck, warning: TriangleAlert, error: CircleAlert };
export function Notice({ variant, title, children }: { variant: NoticeVariant; title: string; children: ReactNode }) {
  const Icon = noticeIcons[variant];
  return <div className={`notice notice--${variant}`} role={variant === "error" ? "alert" : "status"}>
    <Icon aria-hidden="true" size={20} /><div><strong>{title}</strong><div>{children}</div></div>
  </div>;
}
