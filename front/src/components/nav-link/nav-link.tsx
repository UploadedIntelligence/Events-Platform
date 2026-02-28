import './nav-link.scss';
import { NavLink, type NavLinkProps } from 'react-router-dom';

interface CustomNavLinkProps extends NavLinkProps {
    variant?: 'primary' | 'secondary';
}

export function EpNavLink({ children, variant = 'primary', ...remainingProps }: CustomNavLinkProps) {
    return (
        <NavLink className={`EpLinkComponent EpLinkComponent--${variant}`} {...remainingProps}>
            {children}
        </NavLink>
    );
}
