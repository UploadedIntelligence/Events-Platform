import './button.scss';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
}

export function EpButton({ children, variant = 'primary', ...remainingProps }: ButtonProps) {
    return (
        <button className={`EpButton EpButton--${variant}`} {...remainingProps}>
            {children}
        </button>
    );
}
