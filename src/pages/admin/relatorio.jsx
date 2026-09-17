import { Link, Navigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { EtiquetaStatus, containerCard } from '../../components/admin/ElementosAdmin';

const relatorios = {
  individual: {
    titulo: 'Relatório individual',
    descricao: 'Acompanhe o histórico de treinamentos do colaborador selecionado.',
    colunas: ['Treinamento', 'Status', 'Conclusão'],
    linhas: [['NR-35 - Trabalho em Altura', 'Concluído', '12/03/2026'], ['Uso de EPI', 'Concluído', '02/02/2026'], ['Integração de Novos Colaboradores', 'Em andamento', '-']],
  },
  geral: {
    titulo: 'Relatório geral',
    descricao: 'Visão consolidada dos treinamentos da empresa.',
    colunas: ['Colaborador', 'Treinamentos concluídos', 'Pendentes'],
    linhas: [['João Silva', '8', '1'], ['Maria Souza', '9', '0'], ['Pedro Lima', '6', '3']],
  },
};

function Relatorio() {
  const { tipo } = useParams();
  const relatorio = relatorios[tipo];
  if (!relatorio) return <Navigate to="/admin/relatorios" replace />;

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}><IconButton component={Link} to="/admin/relatorios" size="small" sx={{ color: '#1e5139', ml: -1 }} aria-label="Voltar"><ArrowBackRoundedIcon fontSize="small" /></IconButton><Typography sx={{ fontSize: { xs: 22, sm: 26 }, fontWeight: 700, color: '#112f21' }}>{relatorio.titulo}</Typography></Box>
      <Typography sx={{ fontSize: 14, color: '#6b7280', mb: 3.5 }}>{relatorio.descricao}</Typography>
      <Box sx={{ ...containerCard, overflowX: 'auto' }}>
        <Box sx={{ minWidth: 620 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 2, alignItems: 'center', px: 2.5, py: 1.5, bgcolor: '#f6faf8' }}>{relatorio.colunas.map((coluna) => <Typography key={coluna} sx={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{coluna}</Typography>)}</Box>
          {relatorio.linhas.map((linha, indice) => <Box key={linha[0]} sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 2, alignItems: 'center', px: 2.5, py: 2, borderTop: '1px solid #eef2f0' }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}><Box sx={{ width: 34, height: 34, borderRadius: '9px', bgcolor: '#eaf6ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AssessmentOutlinedIcon sx={{ color: '#1e5139', fontSize: 18 }} /></Box><Typography sx={{ fontSize: 14, color: '#1f2937', fontWeight: 500 }}>{linha[0]}</Typography></Box>{tipo === 'individual' && indice < 2 ? <EtiquetaStatus label={linha[1]} tipo="success" /> : tipo === 'individual' ? <EtiquetaStatus label={linha[1]} tipo="warning" /> : <Typography sx={{ fontSize: 14, color: '#374151' }}>{linha[1]}</Typography>}<Typography sx={{ fontSize: 14, color: '#6b7280' }}>{linha[2]}</Typography></Box>)}
        </Box>
      </Box>
    </Box>
  );
}

export default Relatorio;
