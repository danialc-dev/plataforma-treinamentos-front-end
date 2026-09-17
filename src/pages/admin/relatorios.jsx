import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import BarChartIcon from '@mui/icons-material/BarChart';

const opcoes = [
  {
    slug: 'individual',
    titulo: 'Relatório individual',
    descricao: 'Consulte o progresso de um colaborador pela matrícula',
    Icone: PersonSearchIcon,
  },
  {
    slug: 'geral',
    titulo: 'Relatório geral',
    descricao: 'Consulte os treinamentos de todos os colaboradores da empresa',
    Icone: BarChartIcon,
  },
];

function Relatorios() {
  return (
    <Box>
      <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1f2937', mb: 0.5 }}>
        Relatórios
      </Typography>
      <Typography sx={{ fontSize: 14, color: '#6b7280', mb: 4 }}>
        Escolha um relatório para visualizar os dados completos
      </Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        {opcoes.map(({ slug, titulo, descricao, Icone }) => (
          <Box
            key={slug}
            component={Link}
            to={`/admin/relatorios/${slug}`}
            sx={{
              display: 'block',
              textDecoration: 'none',
              bgcolor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 2px rgba(17, 47, 33, 0.06)',
              p: 3,
              width: 260,
              transition: 'box-shadow 0.15s ease, transform 0.15s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(17, 47, 33, 0.12)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                bgcolor: '#eaf6ef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Icone sx={{ color: '#1e5139' }} fontSize="small" />
            </Box>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1f2937', mb: 0.5 }}>
              {titulo}
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#6b7280' }}>{descricao}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Relatorios;
