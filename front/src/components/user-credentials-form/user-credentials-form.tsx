import './user-credentials-form.scss';
import React from 'react';

export function EpUserCredentialsForm({ children, ...remainingProps }: React.ComponentPropsWithRef<'form'>) {
    return (
        <form className="EpCredentialsForm" {...remainingProps}>
            {children}
        </form>
    );
}
