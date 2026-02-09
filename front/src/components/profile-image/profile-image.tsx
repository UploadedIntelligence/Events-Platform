import './profile-image.scss'
import {getSession} from "../../utilities/user-permissions.ts";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export function EpProfileImage() {
    const user = getSession();
    return (
            user?.image ? (
                <img className='EpProfileImage' src={`${user?.image}`} alt="User profile image"/>
                ) : (
                <AccountCircleIcon/>
            )
    )
}