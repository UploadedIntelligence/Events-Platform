import './input-field.scss';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    children?: React.ReactNode;
}

export function EpInputField({ children, ...remainingProps }: InputProps) {
    return (
        <input className='EpInputField' {...remainingProps}>
            {children}
        </input>);
}
