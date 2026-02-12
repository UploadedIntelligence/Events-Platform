import './nav-link.scss';
import { NavLink, type NavLinkProps } from 'react-router-dom';

export function EpNavLink({ children, ...remainingProps }: NavLinkProps) {
    return (
        <NavLink className="EpLinkComponent" {...remainingProps}>
            {children}
        </NavLink>
    );
}
