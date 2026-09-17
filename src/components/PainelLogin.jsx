import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import logoSTW from '../assets/logo-stw.png';

const pontos = [
  'Login com CPF e senha cadastrados',
  'Realize seus treinamentos de forma prática e eficiente',
  'Acompanhe progresso e prazos em um só lugar',
];

function PainelLogin() {
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        width: '596px',
        minHeight: '100vh',
        flexShrink: 0,
        bgcolor: '#1e5139',
        px: '72px',
        py: '96px',
        gap: 2.5,
      }}
    >
      <Box
        component="img"
        src={logoSTW}
        alt="STW"
        sx={{ height: 40, width: 'auto', alignSelf: 'flex-start', mb: 6 }}
      />

      <Typography
        sx={{ fontSize: 36, fontWeight: 700, lineHeight: '44px', color: 'white' }}
      >
        Plataforma de Treinamentos Corporativos
      </Typography>

      <Typography sx={{ fontSize: 14, lineHeight: '22px', color: '#c9eedd' }}>
        Bem-vindo à Plataforma de Treinamentos Corporativos. Esta plataforma  permite que você acesse seus treinamentos, acompanhe seu progresso e prazos em um só lugar.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
        {pontos.map((ponto) => (
          <Box key={ponto} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                mt: '7px',
                borderRadius: '50%',
                bgcolor: '#7fb69e',
                flexShrink: 0,
              }}
            />
            <Typography sx={{ fontSize: 14, lineHeight: '22px', color: '#eff6ff' }}>
              {ponto}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default PainelLogin;