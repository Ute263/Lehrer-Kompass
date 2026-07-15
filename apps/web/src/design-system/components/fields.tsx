import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldState = "default" | "success" | "error";
interface FieldFrameProps { id: string; label: string; hint?: string | undefined; error?: string | undefined; state?: FieldState | undefined; children: React.ReactNode; }
function FieldFrame({ id, label, hint, error, state = "default", children }: FieldFrameProps) {
  const helpId = hint || error ? `${id}-help` : undefined;
  return <div className={`field field--${error ? "error" : state}`}><label htmlFor={id}>{label}</label>{children}{helpId && <span id={helpId} className="field__help">{error ?? hint}</span>}</div>;
}

export function TextField({ label, hint, error, state, id, ...props }: InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; hint?: string; error?: string; state?: FieldState }) {
  const describedBy = hint || error ? `${id}-help` : undefined;
  return <FieldFrame id={id} label={label} hint={hint} error={error} state={state}><input id={id} aria-describedby={describedBy} aria-invalid={Boolean(error)} {...props} /></FieldFrame>;
}
export function TextAreaField({ label, hint, error, state, id, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string; label: string; hint?: string; error?: string; state?: FieldState }) {
  return <FieldFrame id={id} label={label} hint={hint} error={error} state={state}><textarea id={id} aria-describedby={hint || error ? `${id}-help` : undefined} aria-invalid={Boolean(error)} {...props} /></FieldFrame>;
}
export function SelectField({ label, hint, error, id, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { id: string; label: string; hint?: string; error?: string }) {
  return <FieldFrame id={id} label={label} hint={hint} error={error}><select id={id} aria-describedby={hint || error ? `${id}-help` : undefined} aria-invalid={Boolean(error)} {...props}>{children}</select></FieldFrame>;
}
export function Checkbox({ id, label, ...props }: InputHTMLAttributes<HTMLInputElement> & { id: string; label: string }) {
  return <label className="choice" htmlFor={id}><input id={id} type="checkbox" {...props} /><span>{label}</span></label>;
}
export function Switch({ id, label, ...props }: InputHTMLAttributes<HTMLInputElement> & { id: string; label: string }) {
  return <label className="switch" htmlFor={id}><input id={id} type="checkbox" role="switch" {...props} /><span className="switch__track" aria-hidden="true" /><span>{label}</span></label>;
}
