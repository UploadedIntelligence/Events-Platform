import './page-content.scss';
import React from 'react';

export function EpPageContent({ children, ...remainingProps }: React.ComponentPropsWithRef<'div'>) {
    return (
        <div className="EpPageContent" {...remainingProps}>
            {children}
        </div>
    );
}
