import './divider.scss';
import React from 'react';

export function EpDivider({ children, ...remainingProps }: React.ComponentPropsWithRef<'p'>) {
    return (
        <p className="EpDivider" {...remainingProps}>
            {children}
        </p>
    );
}
