import './toggle.scss';
import React from 'react';

export function EpToggle({ children, ...remainingProps }: React.ComponentPropsWithRef<'div'>) {
    return (
        <div className="EpToggle" {...remainingProps}>
            {children}
        </div>
    );
}
