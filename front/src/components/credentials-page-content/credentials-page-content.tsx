import './credentials-page-content.scss';
import React from 'react';

export function EpCredentialsPageContent({ children, ...remainingProps }: React.ComponentPropsWithRef<'div'>) {
    return (
        <div className="EpCredentialsPageContent" {...remainingProps}>
            <div className="EpCredentialsPageContent-container">{children}</div>
        </div>
    );
}
