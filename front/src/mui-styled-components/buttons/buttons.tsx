import './button-styles.scss';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: string;
}

export function PrimaryButton({ children, ...remainingProps }: ButtonProps) {
    return (
        <button className="Primary-button" {...remainingProps}>
            {children}
        </button>
    );
}

export function SecondaryButton({ children, ...remainingProps }: ButtonProps) {
    return (
        <button className="Secondary-button" {...remainingProps}>
            {children}
        </button>
    );
}

export function GhostButton({ children, ...remainingProps }: ButtonProps) {
    return (
        <button className="Ghost-button" {...remainingProps}>
            {children}
        </button>
    );
}
