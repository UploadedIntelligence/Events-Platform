import './search-bar.scss';
import SearchIcon from '@mui/icons-material/Search';
import { EpInputField } from '../input-field/input-field.tsx';
import React from 'react';

export function SearchBar({ ...props }: React.ComponentPropsWithRef<'div'>) {
    return (
        <div className="EpSearchBar" {...props}>
            <EpInputField
                id="EpHeader-searchInput"
                placeholder="Search events"
                startAdornment={
                    <label className="EpSearchBar-label" htmlFor="EpHeader-searchInput">
                        <SearchIcon />
                    </label>
                }
            />
        </div>
    );
}
