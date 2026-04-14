import './event-grid-toggle.scss';
import React from 'react';

export function EpEventGridToggle({ children, ...remainingProps }: React.ComponentPropsWithRef<'div'>) {
    return (
        <div className="EpEventGridToggle" {...remainingProps}>
            {children}
        </div>
    );
}
