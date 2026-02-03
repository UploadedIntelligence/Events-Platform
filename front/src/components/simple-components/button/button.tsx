import './button.scss';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: string;
    variant: 'primary' | 'secondary' | 'ghost';
}

export function CustomButton({ children, ...remainingProps }: ButtonProps) {
    return (
        <button className={`EpButton EpButton--${remainingProps.variant}`} {...remainingProps}>
            {children}
        </button>
    );
}
