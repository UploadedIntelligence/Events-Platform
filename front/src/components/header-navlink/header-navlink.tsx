import './header-navlink.scss';
import { NavLink, type NavLinkProps, useNavigation } from 'react-router-dom';

export function EpHeaderNavLink({ children, ...remainingProps }: NavLinkProps) {
    const navigation = useNavigation();
    const isNavigating = Boolean(navigation.location);
    return (
        <NavLink
            className={({ isActive, isPending }) =>
                `EpHeaderNavLink ${(isActive && !isNavigating) || isPending ? 'active' : ''}`
            }
            {...remainingProps}
        >
            {children}
        </NavLink>
    );
}
