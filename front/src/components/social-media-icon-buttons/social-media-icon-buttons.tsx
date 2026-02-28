import './social-media-icon-buttons.scss';
import { GoogleSignInButton } from '../google-signin-button/google-sign-in-button.tsx';

export function SocialMediaIconButtons() {
    return (
        <div className="EpSocialMedia-loginsContainer">
            <p>Link your account:</p>
            <div className="EpSocialMedia-loginsContainer--option">
                <GoogleSignInButton />
            </div>
        </div>
    );
}
