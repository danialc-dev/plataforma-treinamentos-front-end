import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';
import MenuLateral from './MenuLateral';

function PainelAdmin() {
  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <MenuLateral />
      <Box sx={{ flex: 1, bgcolor: '#f6faf8', p: 5, overflowY: 'auto' }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default PainelAdmin;
