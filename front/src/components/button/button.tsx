import './button.scss';
import React from 'react';

// deprecated
// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//     variant?: 'primary' | 'secondary' | 'ghost';
// }

interface ButtonProps extends React.ComponentPropsWithRef<'button'> {
    variant?: 'primary' | 'secondary' | 'ghost';
}

export function EpButton({ children, variant = 'primary', ...remainingProps }: ButtonProps) {
    return (
        <button className={`EpButton EpButton--${variant}`} {...remainingProps}>
            {children}
        </button>
    );
}
