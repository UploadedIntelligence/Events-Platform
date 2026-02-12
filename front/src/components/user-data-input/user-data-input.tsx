import './user-data-input.scss';
import { EpInputField } from '../input-field/input-field.tsx';
import React from "react";

interface IUserDataInput extends React.ComponentPropsWithRef<'input'> {
    label: string;
}

export function EpUserDataInput({ label, ...props } : IUserDataInput ) {
    return (
        <div className="EpUserDataInput">
            <label>{label}</label>
            <div className="EpInputFieldContainer">
                <EpInputField {...props} />
            </div>
        </div>
    );
}
