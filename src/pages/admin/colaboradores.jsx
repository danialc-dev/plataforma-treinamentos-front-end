import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AssessmentIcon from '@mui/icons-material/Assessment';

const colaboradores = [
  { nome: 'João Silva', cpf: '123.456.789-00' },
  { nome: 'Maria Souza', cpf: '987.654.321-00' },
  { nome: 'Pedro Lima', cpf: '456.789.123-00' },
];

function Colaboradores() {
  return (
    <Box>
      <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1f2937', mb: 0.5 }}>
        Colaboradores
      </Typography>
      <Typography sx={{ fontSize: 14, color: '#6b7280', mb: 4 }}>
        {colaboradores.length} colaboradores cadastrados
      </Typography>

      <Box sx={{ bgcolor: 'white', borderRadius: '12px', boxShadow: '0 1px 2px rgba(17, 47, 33, 0.06)', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', px: 3, py: 1.5, bgcolor: '#f6faf8' }}>
          <Typography sx={{ flex: 2, fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
            Nome
          </Typography>
          <Typography sx={{ flex: 1, fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
            CPF
          </Typography>
          <Box sx={{ width: 40 }} />
        </Box>
        {colaboradores.map(({ nome, cpf }, indice) => (
          <Box
            key={cpf}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 3,
              py: 2,
              borderTop: indice > 0 ? '1px solid #eef2f0' : 'none',
              '&:hover': { bgcolor: '#f9fbfa' },
            }}
          >
            <Typography sx={{ flex: 2, fontSize: 14, color: '#1f2937' }}>{nome}</Typography>
            <Typography sx={{ flex: 1, fontSize: 14, color: '#6b7280' }}>{cpf}</Typography>
            <Box sx={{ width: 40, display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton size="small" title="Ver relatório individual">
                <AssessmentIcon fontSize="small" sx={{ color: '#1e5139' }} />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Colaboradores;
