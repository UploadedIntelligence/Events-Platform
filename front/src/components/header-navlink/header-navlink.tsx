import './header-navlink.scss';
import { NavLink, type NavLinkProps } from 'react-router-dom';

export function EpHeaderNavLink({ children, ...remainingProps }: NavLinkProps) {
    return (
        <NavLink className="EpHeaderNavLink" {...remainingProps}>
            {children}
        </NavLink>
    );
}
