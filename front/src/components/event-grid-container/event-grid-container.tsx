import './event-grid-container.scss';
import React from 'react';

export function EpEventGridContainer({ children }: React.ComponentPropsWithRef<'div'>) {
    return <div className="EpEventGridContainer">{children}</div>;
}
