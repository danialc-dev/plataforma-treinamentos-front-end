import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { CartaoResumo, CabecalhoPagina, EtiquetaStatus, containerCard } from '../../components/admin/ElementosAdmin';

const treinamentos = [
  { nome: 'NR-35 - Trabalho em Altura', categoria: 'Obrigatório', prazo: '30 dias', status: 'Ativo', tipo: 'success' },
  { nome: 'Uso de EPI', categoria: 'Obrigatório', prazo: '15 dias', status: 'Ativo', tipo: 'success' },
  { nome: 'Integração de Novos Colaboradores', categoria: 'Obrigatório', prazo: '7 dias', status: 'Ativo', tipo: 'success' },
  { nome: 'Ergonomia no ambiente de trabalho', categoria: 'Não obrigatório', prazo: '60 dias', status: 'Ativo', tipo: 'success' },
];

function Treinamentos() {
  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
      <CabecalhoPagina titulo="Gestão de treinamentos" descricao={`${treinamentos.length} treinamentos cadastrados`} acao={<Button variant="contained" startIcon={<AddRoundedIcon />} sx={{ height: 40 }}>Criar treinamento</Button>} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }, gap: 1.5, mb: 3.5 }}>
        <CartaoResumo valor={12} texto="Treinamentos ativos" Icone={AssignmentOutlinedIcon} />
        <CartaoResumo valor={8} texto="Obrigatórios" Icone={AssignmentOutlinedIcon} />
        <CartaoResumo valor={3} texto="Com pré-requisito" Icone={AssignmentOutlinedIcon} />
      </Box>

      <Box sx={{ ...containerCard, overflow: 'hidden' }}>
        <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}><Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Treinamentos cadastrados</Typography><Typography sx={{ fontSize: 12, color: '#6b7280', mt: 0.5 }}>Gerencie os conteúdos disponíveis para os colaboradores</Typography></Box>
        {treinamentos.map((treinamento) => (
          <Box key={treinamento.nome} sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1.5, flexDirection: { xs: 'column', sm: 'row' }, px: 2.5, py: 2, borderTop: '1px solid #eef2f0', '&:hover': { bgcolor: '#f9fbfa' } }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#eaf6ef', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AssignmentOutlinedIcon sx={{ color: '#1e5139' }} fontSize="small" /></Box>
            <Box sx={{ flex: 1, minWidth: 0 }}><Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1f2937', mb: 0.75 }}>{treinamento.nome}</Typography><Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}><EtiquetaStatus label={treinamento.categoria} tipo={treinamento.categoria === 'Obrigatório' ? 'warning' : 'neutral'} /><Typography sx={{ fontSize: 12, color: '#6b7280' }}>Prazo: {treinamento.prazo}</Typography></Box></Box>
            <EtiquetaStatus label={treinamento.status} tipo={treinamento.tipo} />
            <Box sx={{ display: 'flex', gap: 0.5 }}><IconButton size="small" title="Editar"><EditOutlinedIcon fontSize="small" sx={{ color: '#6b7280' }} /></IconButton><IconButton size="small" title="Inativar"><DeleteOutlineRoundedIcon fontSize="small" sx={{ color: '#6b7280' }} /></IconButton></Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Treinamentos;
