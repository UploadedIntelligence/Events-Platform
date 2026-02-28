import './input-field.scss';
import React from 'react';

export interface ICustomInputField extends React.ComponentPropsWithRef<'input'> {
    error?: boolean;
    helperText?: string;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
}

export interface ICustomTextArea extends React.ComponentPropsWithRef<'textarea'> {
    error?: boolean;
    helperText?: string;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    multiline?: boolean;
    rows?: number;
}

export function EpInputField(props: ICustomInputField | ICustomTextArea) {
    let error, helperText, startAdornment, endAdornment, multiline, rows, remainingProps;
    if ('multiline' in props) {
        ({ error, helperText, startAdornment, endAdornment, multiline, rows, ...remainingProps } = props);
    } else {
        ({ error, helperText, startAdornment, endAdornment, ...remainingProps } = props);
    }

    return (
        <div className="EpInputField">
            <div className={`EpInputField-container ${error ? 'hasError' : ''}`}>
                {startAdornment}
                {multiline ? (
                    <textarea className="EpInputField-input" rows={rows} {...remainingProps} />
                ) : (
                    <input className="EpInputField-input" {...remainingProps} />
                )}
                {endAdornment}
            </div>
            {error && <p className="EpInputField-error">{helperText}</p>}
        </div>
    );
}
