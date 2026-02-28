import './main-background.scss';
import React from 'react';

export function MainBackground({ children, ...remainingProps }: React.ComponentPropsWithRef<'div'>) {
    return (
        <div className="EpMainBackground" {...remainingProps}>
            {children}
        </div>
    );
}
