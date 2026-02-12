import './input-field.scss';
import React from 'react';

export function EpInputField({ children, ...remainingProps }: React.ComponentPropsWithRef<'input'>) {
    return (
        <input className="EpInputField" {...remainingProps}>
            {children}
        </input>
    );
}
