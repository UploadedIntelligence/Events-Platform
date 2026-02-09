import './search-bar.scss';
import SearchIcon from '@mui/icons-material/Search';
import { EpInputField } from '../input-field/input-field.tsx';

export function SearchBar() {
    return (
        <div className="EpSearchBar">
            <SearchIcon sx={{ color: 'grey' }} />
            <EpInputField placeholder="Search events" />
        </div>
    );
}
