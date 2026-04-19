import { Button, CardActions, Card } from '@mui/material';
import { NavLink } from 'react-router-dom';

export function UserSettings() {
    return (
        <div>
            <Card>
                <NavLink to="/user-profile">
                    <Button variant="outlined" sx={{ margin: '10px' }}>
                        Go Back
                    </Button>
                </NavLink>

                <CardActions></CardActions>
            </Card>
        </div>
    );
}
