import './event-grid.scss';
import React from 'react';

export function EpEventGrid({ children, ...remainingProps }: React.ComponentPropsWithRef<'div'>) {
    return (
        <div className="EpEventGrid" {...remainingProps}>
            {children}
        </div>
    );
}
