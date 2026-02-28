import './user-data-input.scss';
import { type ICustomInputField, EpInputField } from '../input-field/input-field.tsx';
import React from 'react';

interface IUserDataInput extends React.ComponentPropsWithRef<'input'>, ICustomInputField {
    label?: string;
    multiline?: boolean;
    rows?: number;
}

export function EpUserDataInput({ label, multiline = false, rows, ...props }: IUserDataInput) {
    return (
        <div className="EpUserDataInput">
            <label className="EpUserDataInput-label">{label}</label>
            <EpInputField multiline={multiline} rows={rows} {...props} />
        </div>
    );
}
