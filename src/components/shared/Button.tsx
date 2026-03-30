import type { JSX } from "solid-js";

type ButtonVariant = "primary" | "secondary" | "destructive" | "plain";

interface ButtonProps {
  variant?: ButtonVariant;
  children: JSX.Element;
  onClick?: () => void;
  disabled?: boolean;
  class?: string;
  type?: "button" | "submit";
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-hover active:brightness-90",
  secondary:
    "bg-surface-secondary text-text-primary border border-border hover:bg-surface-hover active:bg-surface-selected",
  destructive:
    "bg-tag-red/10 text-tag-red hover:bg-tag-red/20 active:bg-tag-red/30",
  plain:
    "text-text-secondary hover:text-text-primary hover:bg-surface-hover active:bg-surface-selected",
};

export function Button(props: ButtonProps) {
  const variant = () => props.variant ?? "secondary";

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      class={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 h-7 text-[13px] font-medium transition-colors cursor-default disabled:opacity-40 disabled:pointer-events-none ${variantClasses[variant()]} ${props.class ?? ""}`}
    >
      {props.children}
    </button>
  );
}
