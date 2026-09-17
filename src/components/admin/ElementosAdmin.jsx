import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

export function CabecalhoPagina({ titulo, descricao, acao }) {
  return (
    <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mb: 3.5 }}>
      <Box>
        <Typography sx={{ fontSize: { xs: 22, sm: 26 }, fontWeight: 700, color: '#112f21' }}>{titulo}</Typography>
        <Typography sx={{ fontSize: 14, color: '#6b7280', mt: 0.5 }}>{descricao}</Typography>
      </Box>
      {acao}
    </Box>
  );
}

export function CartaoResumo({ valor, texto, Icone, cor = '#1e5139', fundo = '#eaf6ef' }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'white', borderRadius: '12px', p: 2.25, boxShadow: '0 1px 2px rgba(17, 47, 33, 0.06)' }}>
      <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: fundo, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icone sx={{ color: cor }} fontSize="small" /></Box>
      <Box><Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1f2937', lineHeight: 1.15 }}>{valor}</Typography><Typography sx={{ fontSize: 12, color: '#6b7280' }}>{texto}</Typography></Box>
    </Box>
  );
}

export function EtiquetaStatus({ label, tipo = 'neutral' }) {
  const cores = { success: { bgcolor: '#eaf6ef', color: '#28734b' }, warning: { bgcolor: '#fff4e5', color: '#9a6700' }, danger: { bgcolor: '#fdeceb', color: '#b42318' }, neutral: { bgcolor: '#eef4f1', color: '#486859' } };
  return <Chip label={label} size="small" sx={{ height: 24, ...cores[tipo], fontSize: 11, fontWeight: 600 }} />;
}

export const containerCard = { bgcolor: 'white', borderRadius: '12px', boxShadow: '0 1px 2px rgba(17, 47, 33, 0.06)' };
