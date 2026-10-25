import type { ComponentPropsWithoutRef } from "react";

type Props = Omit<ComponentPropsWithoutRef<"a">, "target" | "rel">;

/* Keep the visible label concise; announce this behaviour once per link. */
export default function NewTabLink({ children, ...props }: Props) {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="srOnly"> (opens in a new tab)</span>
    </a>
  );
}
