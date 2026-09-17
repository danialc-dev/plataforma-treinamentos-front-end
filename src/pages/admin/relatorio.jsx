import { Link, Navigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const relatorios = {
  individual: {
    titulo: 'Relatório individual',
    colunas: ['Treinamento', 'Status', 'Conclusão'],
    linhas: [
      ['NR-35 - Trabalho em Altura', 'Concluído', '12/03/2026'],
      ['Uso de EPI', 'Concluído', '02/02/2026'],
      ['Integração de Novos Colaboradores', 'Em andamento', '-'],
    ],
  },
  geral: {
    titulo: 'Relatório geral',
    colunas: ['Colaborador', 'Treinamentos concluídos', 'Pendentes'],
    linhas: [
      ['João Silva', '8', '1'],
      ['Maria Souza', '9', '0'],
      ['Pedro Lima', '6', '3'],
    ],
  },
};

function Relatorio() {
  const { tipo } = useParams();
  const relatorio = relatorios[tipo];

  if (!relatorio) {
    return <Navigate to="/admin/relatorios" replace />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconButton component={Link} to="/admin/relatorios" size="small">
          <ArrowBackIcon fontSize="small" sx={{ color: '#1f2937' }} />
        </IconButton>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1f2937' }}>
          {relatorio.titulo}
        </Typography>
      </Box>

      <Box sx={{ bgcolor: 'white', borderRadius: '12px', boxShadow: '0 1px 2px rgba(17, 47, 33, 0.06)', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', px: 3, py: 1.5, bgcolor: '#f6faf8' }}>
          {relatorio.colunas.map((coluna) => (
            <Typography
              key={coluna}
              sx={{ flex: 1, fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}
            >
              {coluna}
            </Typography>
          ))}
        </Box>
        {relatorio.linhas.map((linha, indice) => (
          <Box
            key={linha[0]}
            sx={{ display: 'flex', px: 3, py: 2, borderTop: indice > 0 ? '1px solid #eef2f0' : 'none' }}
          >
            {linha.map((valor) => (
              <Typography key={valor} sx={{ flex: 1, fontSize: 14, color: '#1f2937' }}>
                {valor}
              </Typography>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Relatorio;
