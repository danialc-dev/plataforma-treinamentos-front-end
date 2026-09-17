import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuLateralColaborador from './MenuLateralColaborador';

function PainelColaborador() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [menuRecolhido, setMenuRecolhido] = useState(false);

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden', bgcolor: '#f6faf8' }}>
      <Box sx={{ display: { xs: 'none', md: 'block' }, height: '100vh', flexShrink: 0 }}>
        <MenuLateralColaborador recolhido={menuRecolhido} onToggle={() => setMenuRecolhido((valor) => !valor)} />
      </Box>

      <Drawer
        open={menuAberto}
        onClose={() => setMenuAberto(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { bgcolor: '#1e5139' } }}
      >
        <MenuLateralColaborador mobile onClose={() => setMenuAberto(false)} />
      </Drawer>

      <Box component="main" sx={{ flex: 1, minWidth: 0, height: '100vh', p: { xs: 2, sm: 3, lg: 5 }, overflowY: 'auto' }}>
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => setMenuAberto(true)} size="small" sx={{ color: '#1e5139', mr: 1 }} aria-label="Abrir menu">
            <MenuIcon />
          </IconButton>
        </Box>
        <Outlet />
      </Box>
    </Box>
  );
}

export default PainelColaborador;
