import './event-container.scss';
import React from 'react';

export function EpEventContainer({ children }: React.ComponentPropsWithRef<'div'>) {
    return <div className="EpEventContainer">{children}</div>;
}
