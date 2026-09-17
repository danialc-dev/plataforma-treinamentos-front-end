import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GroupIcon from '@mui/icons-material/Group';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import logoStw from '../../assets/logo-stw.png';

const itens = [
  { caminho: '/admin/treinamentos', texto: 'Gestão de Treinamentos', Icone: AssignmentIcon },
  { caminho: '/admin/relatorios', texto: 'Relatórios', Icone: AssessmentIcon },
  { caminho: '/admin/colaboradores', texto: 'Colaboradores', Icone: GroupIcon },
];

function MenuLateral() {
  const [aberto, setAberto] = useState(true);

  return (
    <Box
      sx={{
        width: aberto ? 240 : 76,
        minHeight: '100vh',
        flexShrink: 0,
        bgcolor: '#1e5139',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        py: 3,
        px: aberto ? 2 : 1,
        transition: 'width 0.2s ease',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: aberto ? 'space-between' : 'center' }}>
        {aberto && (
          <Box component={Link} to="/admin">
            <Box component="img" src={logoStw} alt="STW" sx={{ height: 24, width: 'auto' }} />
          </Box>
        )}
        <IconButton onClick={() => setAberto((valor) => !valor)} size="small" sx={{ color: '#c9eedd' }}>
          <MenuIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {itens.map(({ caminho, texto, Icone }) => (
          <Box
            key={caminho}
            component={NavLink}
            to={caminho}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              justifyContent: aberto ? 'flex-start' : 'center',
              px: 1.5,
              py: 1.25,
              borderRadius: '8px',
              borderLeft: '3px solid transparent',
              color: 'white',
              fontSize: 14,
              fontWeight: 400,
              letterSpacing: '0.01em',
              textDecoration: 'none',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
              '&.active': {
                bgcolor: 'rgba(255,255,255,0.14)',
                borderLeft: '3px solid #7fd9ac',
                fontWeight: 600,
              },
            }}
          >
            <Icone fontSize="small" />
            {aberto && (
              <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}>
                {texto}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      <Box
        component={Link}
        to="/"
        sx={{
          mt: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          justifyContent: aberto ? 'flex-start' : 'center',
          px: 1.5,
          py: 1.25,
          borderRadius: '8px',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          pt: 2.5,
          color: 'white',
          fontSize: 14,
          fontWeight: 400,
          textDecoration: 'none',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
        }}
      >
        <LogoutOutlinedIcon fontSize="small" />
        {aberto && <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}>Sair</Typography>}
      </Box>
    </Box>
  );
}

export default MenuLateral;
