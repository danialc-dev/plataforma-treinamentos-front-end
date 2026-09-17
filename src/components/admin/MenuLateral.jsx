import { Link, NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import logoStw from '../../assets/logo-stw.png';
import { usuarioAdmin } from '../../data/admin';

const itens = [
  { caminho: '/admin', texto: 'Início', Icone: HomeRoundedIcon, index: true },
  { caminho: '/admin/treinamentos', texto: 'Gestão de treinamentos', Icone: AssignmentOutlinedIcon },
  { caminho: '/admin/relatorios', texto: 'Relatórios', Icone: AssessmentOutlinedIcon },
  { caminho: '/admin/colaboradores', texto: 'Colaboradores', Icone: GroupOutlinedIcon },
];

function MenuLateral({ mobile = false, recolhido = false, onClose, onToggle }) {
  const compacto = !mobile && recolhido;
  const iniciais = usuarioAdmin.nome.split(' ').filter(Boolean).slice(0, 2).map((nome) => nome[0]).join('');
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
        transition: 'width 0.2s ease, padding 0.2s ease',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: compacto ? 'center' : 'space-between', px: 0.5, minHeight: 24 }}>
        <Box component={Link} to="/admin" onClick={onClose} sx={{ display: compacto ? 'none' : 'flex' }}>
          <Box component="img" src={logoStw} alt="STW" sx={{ height: 24, width: 'auto' }} />
        </Box>
        {!mobile && (
          <IconButton className="admin-sidebar-toggle" onClick={onToggle} size="small" sx={{ color: '#c9eedd', transform: compacto ? 'rotate(180deg)' : 'none' }} aria-label={compacto ? 'Expandir sidebar' : 'Recolher sidebar'}>
            <MenuOpenRoundedIcon fontSize="small" />
          </IconButton>
        )}
        {mobile && (
          <IconButton onClick={onClose} size="small" sx={{ color: '#c9eedd' }} aria-label="Fechar menu">
            <MenuRoundedIcon fontSize="small" />
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
              display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: compacto ? 'center' : 'flex-start',
              ml: 0.5, mr: 1, px: compacto ? 0 : 1.5, py: 1.25, borderRadius: '8px', borderLeft: '3px solid transparent',
              color: 'white', fontSize: 14, textDecoration: 'none', transition: 'background-color 0.15s ease',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
              '&.active': { bgcolor: 'rgba(255,255,255,0.14)', borderLeftColor: '#7fd9ac', fontWeight: 600 },
            }}
          >
            <Icone fontSize="small" />
            <Typography className="admin-sidebar-label" sx={{ display: compacto ? 'none' : 'block', fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit', whiteSpace: 'nowrap' }}>
              {texto}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 'auto', pt: 2.5, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, justifyContent: compacto ? 'center' : 'flex-start', px: 1, mb: 2.5 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: '#c9eedd', color: '#1e5139', fontSize: 12, fontWeight: 700 }}>{iniciais}</Avatar>
          <Box className="admin-sidebar-profile" sx={{ display: compacto ? 'none' : 'block', minWidth: 0 }}>
            <Typography noWrap sx={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{usuarioAdmin.nome}</Typography>
            <Typography noWrap sx={{ color: '#c9eedd', fontSize: 11 }}>{usuarioAdmin.perfil} · {usuarioAdmin.cpf}</Typography>
          </Box>
        </Box>
        <Box component={Link} to="/" onClick={onClose} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: compacto ? 'center' : 'flex-start', mx: 0.5, px: compacto ? 0 : 1.5, py: 1.25, borderRadius: '8px', color: 'white', fontSize: 14, textDecoration: 'none', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
          <LogoutOutlinedIcon fontSize="small" />
          <Typography className="admin-sidebar-label" sx={{ display: compacto ? 'none' : 'block', fontSize: 'inherit', color: 'inherit', whiteSpace: 'nowrap' }}>Sair</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default MenuLateral;
