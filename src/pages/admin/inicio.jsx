import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { CartaoResumo, EtiquetaStatus, containerCard } from '../../components/admin/ElementosAdmin';
import { resumoAdmin, usuarioAdmin } from '../../data/admin';

const cartoes = [
  { valor: resumoAdmin.colaboradores, texto: 'Colaboradores', Icone: GroupOutlinedIcon },
  { valor: resumoAdmin.treinamentos, texto: 'Treinamentos ativos', Icone: AssignmentOutlinedIcon },
  { valor: resumoAdmin.pendentes, texto: 'Treinamentos pendentes', Icone: TrendingUpRoundedIcon },
  { valor: resumoAdmin.atrasados, texto: 'Treinamentos atrasados', Icone: WarningAmberRoundedIcon, cor: '#b42318', fundo: '#fdeceb' },
];

const atencoes = [
  { texto: 'NR-35 - Trabalho em Altura', detalhe: '8 colaboradores com prazo próximo', tipo: 'warning', label: 'Atenção' },
  { texto: 'Uso de EPI', detalhe: '8 colaboradores com treinamento atrasado', tipo: 'danger', label: 'Atrasado' },
  { texto: 'Integração de Novos Colaboradores', detalhe: '3 colaboradores ainda não iniciaram', tipo: 'neutral', label: 'Acompanhar' },
];

const atividades = [
  'João Silva concluiu o treinamento NR-35',
  'Maria Souza concluiu o treinamento Uso de EPI',
  'Pedro Lima iniciou o treinamento Integração',
  'Ana Costa concluiu o treinamento NR-35',
];

function Inicio() {
  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: { xs: 22, sm: 26 }, fontWeight: 700, color: '#112f21' }}>Olá, {usuarioAdmin.nome.split(' ')[0]}!</Typography>
        <Typography sx={{ fontSize: 14, color: '#6b7280', mt: 0.5 }}>Acompanhe o desempenho dos treinamentos da sua empresa.</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 3, bgcolor: '#1e5139', borderRadius: '16px', p: { xs: 2.5, sm: 3.5 }, mb: 2.5, overflow: 'hidden', position: 'relative' }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}><Typography sx={{ color: '#c9eedd', fontSize: 13, mb: 0.75 }}>Visão geral dos treinamentos</Typography><Typography sx={{ color: 'white', fontSize: 30, lineHeight: 1.15, fontWeight: 700 }}>{resumoAdmin.percentual}% concluído</Typography><Typography sx={{ color: '#c9eedd', fontSize: 13, mt: 0.75 }}>Acompanhe os prazos e mantenha sua equipe em dia.</Typography></Box>
        <Box sx={{ width: { xs: '100%', sm: 280 }, position: 'relative', zIndex: 1 }}><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography sx={{ color: '#eff6ff', fontSize: 12 }}>Conclusão da empresa</Typography><Typography sx={{ color: '#eff6ff', fontSize: 12, fontWeight: 600 }}>{resumoAdmin.percentual}%</Typography></Box><LinearProgress variant="determinate" value={resumoAdmin.percentual} sx={{ height: 8, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: '#9ce4bc', borderRadius: 5 } }} /></Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }, gap: 1.5, mb: 3.5 }}>{cartoes.map((cartao) => <CartaoResumo key={cartao.texto} {...cartao} />)}</Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.15fr) minmax(360px, 0.85fr)' }, gap: 2.5 }}>
        <Box sx={{ ...containerCard, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', px: 2.5, pt: 2.5, pb: 1.5 }}><Box><Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Atenção necessária</Typography><Typography sx={{ fontSize: 12, color: '#6b7280', mt: 0.5 }}>Acompanhe os pontos que precisam de ação</Typography></Box><WarningAmberRoundedIcon sx={{ color: '#b7791f' }} fontSize="small" /></Box>
          {atencoes.map((item) => <Box key={item.texto} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 2, borderTop: '1px solid #eef2f0' }}><Box sx={{ flex: 1, minWidth: 0 }}><Typography sx={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{item.texto}</Typography><Typography sx={{ fontSize: 12, color: '#6b7280', mt: 0.25 }}>{item.detalhe}</Typography></Box><EtiquetaStatus label={item.label} tipo={item.tipo} /></Box>)}
        </Box>

        <Box sx={{ ...containerCard, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', px: 2.5, pt: 2.5, pb: 1.5 }}><Box><Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Atividade recente</Typography><Typography sx={{ fontSize: 12, color: '#6b7280', mt: 0.5 }}>Últimas movimentações da equipe</Typography></Box><CheckCircleOutlineRoundedIcon sx={{ color: '#1e5139' }} fontSize="small" /></Box>
          {atividades.map((atividade) => <Box key={atividade} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, px: 2.5, py: 1.75, borderTop: '1px solid #eef2f0' }}><CheckCircleOutlineRoundedIcon sx={{ color: '#4c9a70', fontSize: 18, mt: 0.1 }} /><Typography sx={{ fontSize: 13, lineHeight: 1.5, color: '#4b5563' }}>{atividade}</Typography></Box>)}
          <Box sx={{ px: 2.5, pb: 2.5, pt: 1 }}><Button component={Link} to="/admin/relatorios" variant="text" endIcon={<ArrowForwardRoundedIcon />} sx={{ px: 0, color: '#1e5139' }}>Ver relatórios</Button></Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Inicio;
