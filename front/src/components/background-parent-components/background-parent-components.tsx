import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

const userTheme: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;

export const StyledPaper = styled(Paper)(() => ({
    padding: '10px',
    width: '90%',
    justifySelf: 'center',
    background: 'transparent',
    height: '100%',
    minHeight: '90vh',
    boxShadow: 'none',
}));

export const BackgroundPaper = styled(Paper)(() => ({
    background: userTheme ? '#212830' : '#f4f4f4',
}));
