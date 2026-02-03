import './button-styles.scss';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: string;
    variant: 'primary' | 'secondary' | 'ghost';
}

export function CustomButton({ children, ...remainingProps }: ButtonProps) {
    return (
        <button className={`${remainingProps.variant}-button`} {...remainingProps}>
            {children}
        </button>
    );
}
