import './button.scss';
import React from 'react';

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
