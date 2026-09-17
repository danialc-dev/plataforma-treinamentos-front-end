import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const totalAtrasados = 8;

const cartoes = [
  { valor: 132, texto: 'Colaboradores', Icone: GroupIcon, cor: '#1e5139', fundo: '#eaf6ef' },
  { valor: 12, texto: 'Treinamentos', Icone: AssignmentIcon, cor: '#1e5139', fundo: '#eaf6ef' },
  { valor: totalAtrasados, texto: 'Treinamentos em atraso', Icone: WarningAmberIcon, cor: '#b42318', fundo: '#fdeceb' },
];

const logs = [
  'João concluiu o treinamento NR-35',
  'Maria concluiu o treinamento Uso de EPI',
  'Pedro iniciou o treinamento Integração',
  'Ana concluiu o treinamento NR-35',
  'Carlos iniciou o treinamento Uso de EPI',
  'Fernanda concluiu o treinamento Integração',
];

function Inicio() {
  return (
    <Box>
      <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1f2937' }}>Início</Typography>
      <Typography sx={{ fontSize: 14, color: '#6b7280', mt: 0.5, mb: 4 }}>
        Visão geral da plataforma
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        {cartoes.map(({ valor, texto, Icone, cor, fundo }) => (
          <Box
            key={texto}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              bgcolor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 2px rgba(17, 47, 33, 0.06)',
              p: 3,
              minWidth: 200,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                bgcolor: fundo,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icone sx={{ color: cor }} fontSize="small" />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 26, fontWeight: 700, color: '#1f2937', lineHeight: 1.2 }}>
                {valor}
              </Typography>
              <Typography sx={{ fontSize: 13, color: '#6b7280' }}>{texto}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ bgcolor: 'white', borderRadius: '12px', boxShadow: '0 1px 2px rgba(17, 47, 33, 0.06)', p: 3 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1f2937', mb: 2 }}>
          Atividade recente
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {logs.map((log, indice) => (
            <Box key={log} sx={{ py: 1.5, borderTop: indice > 0 ? '1px solid #eef2f0' : 'none' }}>
              <Typography sx={{ fontSize: 14, color: '#374151' }}>{log}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Inicio;
