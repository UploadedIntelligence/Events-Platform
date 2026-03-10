import './credentials-page-content.scss';
import React from 'react';

interface ICredentialsPageContent extends React.ComponentPropsWithRef<'div'> {
    variant?: 'wide';
}

export function EpCredentialsPageContent({ children, variant, ...remainingProps }: ICredentialsPageContent) {
    return (
        <div className="EpCredentialsPageContent" {...remainingProps}>
            <div className={`EpCredentialsPageContent-container ${variant ? 'wide' : ''}`}>{children}</div>
        </div>
    );
}
