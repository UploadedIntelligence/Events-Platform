import { Button, CardActions, Card } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { getSession } from '../../../../utilities/user-permissions.ts';
import { StyledPaper } from '../../../../mui-styled-components';

export function UserSettings() {
    const user = getSession();

    return user?.role !== 'user' ? (
        <StyledPaper>
            <Card>
                <NavLink to="/user-profile">
                    <Button variant="outlined" sx={{ margin: '10px' }}>
                        Go Back
                    </Button>
                </NavLink>

                <CardActions></CardActions>
            </Card>
        </StyledPaper>
    ) : null;
}
