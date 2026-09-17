import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';

const treinamentos = [
  'NR-35 - Trabalho em Altura',
  'Uso de EPI',
  'Integração de Novos Colaboradores',
];

function Treinamentos() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1f2937' }}>
            Gestão de Treinamentos
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#6b7280', mt: 0.5 }}>
            {treinamentos.length} treinamentos cadastrados
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ height: 40 }}>
          Criar
        </Button>
      </Box>

      <Box sx={{ bgcolor: 'white', borderRadius: '12px', boxShadow: '0 1px 2px rgba(17, 47, 33, 0.06)' }}>
        {treinamentos.map((nome, indice) => (
          <Box
            key={nome}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 3,
              py: 2,
              borderTop: indice > 0 ? '1px solid #eef2f0' : 'none',
              '&:hover': { bgcolor: '#f9fbfa' },
            }}
          >
            <Typography sx={{ fontSize: 14, color: '#1f2937' }}>{nome}</Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" title="Editar">
                <EditOutlinedIcon fontSize="small" sx={{ color: '#6b7280' }} />
              </IconButton>
              <IconButton size="small" title="Excluir">
                <DeleteOutlineIcon fontSize="small" sx={{ color: '#6b7280' }} />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Treinamentos;
