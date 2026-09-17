import { Link, NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import Avatar from '@mui/material/Avatar';
import logoStw from '../../assets/logo-stw.png';
import { colaborador } from '../../data/colaborador';

const itens = [
  { caminho: '/colaborador', texto: 'Início', Icone: HomeRoundedIcon, index: true },
  { caminho: '/colaborador/treinamentos', texto: 'Meus treinamentos', Icone: SchoolOutlinedIcon },
  { caminho: '/colaborador/progresso', texto: 'Meu progresso', Icone: TrendingUpRoundedIcon },
];

function MenuLateralColaborador({ mobile = false, recolhido = false, onClose, onToggle }) {
  const compacto = !mobile && recolhido;
  const iniciais = colaborador.nome
    .split(' ')
    .slice(0, 2)
    .map((nome) => nome[0])
    .join('');

  return (
    <Box
      component="aside"
      sx={{
        width: mobile || !compacto ? 280 : 76,
        height: mobile ? '100%' : '100vh',
        minHeight: 0,
        flexShrink: 0,
        bgcolor: '#1e5139',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        py: 3,
        px: mobile || !compacto ? 2 : 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: compacto ? 'center' : 'space-between', px: 0.5 }}>
        <Box component={Link} to="/colaborador" onClick={onClose} sx={{ display: compacto ? 'none' : 'flex' }}>
          <Box component="img" src={logoStw} alt="STW" sx={{ height: 24, width: 'auto' }} />
        </Box>
        {onToggle && (
          <IconButton onClick={onToggle} size="small" sx={{ color: '#c9eedd', transform: compacto ? 'rotate(180deg)' : 'none' }} aria-label={compacto ? 'Expandir sidebar' : 'Recolher sidebar'}>
            <MenuOpenRoundedIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {itens.map(({ caminho, texto, Icone, index }) => (
          <Box
            key={caminho}
            component={NavLink}
            to={caminho}
            end={index}
            onClick={onClose}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              justifyContent: compacto ? 'center' : 'flex-start',
              ml: 0.5,
              mr: 1,
              px: compacto ? 0 : 1.5,
              py: 1.25,
              borderRadius: '8px',
              borderLeft: '3px solid transparent',
              color: 'white',
              fontSize: 14,
              textDecoration: 'none',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
              '&.active': {
                bgcolor: 'rgba(255,255,255,0.14)',
                borderLeftColor: '#7fd9ac',
                fontWeight: 600,
              },
            }}
          >
            <Icone fontSize="small" />
            <Typography sx={{ display: compacto ? 'none' : 'block', fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}>
              {texto}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          mt: 'auto',
          pt: 2.5,
          borderTop: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, justifyContent: compacto ? 'center' : 'flex-start', px: 1, mb: 2.5 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: '#c9eedd', color: '#1e5139', fontSize: 13, fontWeight: 700 }}>
            {iniciais}
          </Avatar>
          <Box sx={{ display: compacto ? 'none' : 'block', minWidth: 0 }}>
            <Typography noWrap sx={{ color: 'white', fontSize: 13, fontWeight: 600 }}>
              {colaborador.nome}
            </Typography>
            <Typography noWrap sx={{ color: '#c9eedd', fontSize: 11 }}>
              {colaborador.perfil} · {colaborador.cpf}
            </Typography>
          </Box>
        </Box>

        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            justifyContent: compacto ? 'center' : 'flex-start',
            mx: 0.5,
            px: compacto ? 0 : 1.5,
            py: 1.25,
            borderRadius: '8px',
            color: 'white',
            fontSize: 14,
            textDecoration: 'none',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
          }}
        >
          <LogoutOutlinedIcon fontSize="small" />
          <Typography sx={{ display: compacto ? 'none' : 'block', fontSize: 'inherit', color: 'inherit' }}>Sair</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default MenuLateralColaborador;
