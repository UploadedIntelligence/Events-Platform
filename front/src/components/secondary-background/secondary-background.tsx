import './secondary-background.scss';
import React from 'react';

export function EpSecondaryBackground({ children, ...remainingProps }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className="EpSecondaryBackground" {...remainingProps}>
            {children}
        </div>
    );
}
