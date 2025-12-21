import { Typography } from '@mui/material';
import { GoogleSignInButton } from './google-sign-in-button.tsx';

export function SocialMediaIconButtons() {
    return (
        <div className="Social-media-icon-buttons">
            <Typography sx={{ margin: '5px' }}>Link your account:</Typography>
            <GoogleSignInButton />
        </div>
    );
}
