import { type ReactNode } from "react";

export type LinkProps = {
    to: string;
    target?: string;
    children?: ReactNode;
}

export default function Link({ to, target, children }: LinkProps) {
    return (
        <a href={to} className="link" target={target}>
            {children}
        </a>
    )
}