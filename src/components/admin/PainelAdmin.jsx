import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { Outlet } from 'react-router-dom';
import MenuLateral from './MenuLateral';

function PainelAdmin() {
  const [menuRecolhido, setMenuRecolhido] = useState(false);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden', bgcolor: '#f6faf8' }}>
      <Box
        sx={{
          display: { xs: 'none', md: 'block' }, height: '100vh', flexShrink: 0,
        }}
      >
        <MenuLateral recolhido={menuRecolhido} onToggle={() => setMenuRecolhido((valor) => !valor)} />
      </Box>

      <Drawer open={menuMobileAberto} onClose={() => setMenuMobileAberto(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { bgcolor: '#1e5139' } }}>
        <MenuLateral mobile onClose={() => setMenuMobileAberto(false)} />
      </Drawer>

      <Box component="main" sx={{ flex: 1, minWidth: 0, height: '100vh', p: { xs: 2, sm: 3, lg: 5 }, overflowY: 'auto' }}>
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => setMenuMobileAberto(true)} size="small" sx={{ color: '#1e5139', mr: 1 }} aria-label="Abrir menu">
            <MenuRoundedIcon />
          </IconButton>
        </Box>
        <Outlet />
      </Box>
    </Box>
  );
}

export default PainelAdmin;
