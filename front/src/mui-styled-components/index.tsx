import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

export const StyledPaper = styled(Paper)(() => ({
    padding: '10px',
    width: '90%',
    justifySelf: 'center',
    background: 'transparent',
    height: '100%',
    minHeight: '100vh',
}));
