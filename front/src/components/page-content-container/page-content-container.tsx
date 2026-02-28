import './page-content-container.scss';
import React from 'react';

export function EpPageContentContainer({ children, ...remainingProps }: React.ComponentPropsWithRef<'div'>) {
    return (
        <div className="EpPageContent-container" {...remainingProps}>
            {children}
        </div>
    );
}
