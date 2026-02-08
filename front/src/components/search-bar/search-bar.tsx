import './search-bar.scss';
import SearchIcon from '@mui/icons-material/Search';

export function SearchBar() {
    return (
        <div className="EpSearchBar">
            <SearchIcon sx={{ color: 'grey'}} />
            <input className='EpInputField' placeholder="Search events"/>
        </div>
    );
}
