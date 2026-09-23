import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { dashboardColaborador } from '../../services/api';

const cartoesResumo = [
  { chave: 'pendentes', texto: 'A fazer', Icone: SchoolOutlinedIcon, cor: '#1e5139', fundo: '#eaf6ef' },
  { chave: 'emAndamento', texto: 'Em andamento', Icone: TrendingUpRoundedIcon, cor: '#176b52', fundo: '#e5f5ef' },
  { chave: 'concluidos', texto: 'Concluídos', Icone: CheckCircleOutlineRoundedIcon, cor: '#2f855a', fundo: '#eaf6ef' },
  { chave: 'atrasados', texto: 'Atrasados', Icone: WarningAmberRoundedIcon, cor: '#b42318', fundo: '#fdeceb' },
];

function CartaoResumo({ valor, texto, Icone, cor, fundo }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'white', borderRadius: '12px', p: 2.25, boxShadow: '0 1px 2px rgba(17, 47, 33, 0.06)' }}>
      <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: fundo, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icone sx={{ color: cor }} fontSize="small" />
      </Box>
      <Box>
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1f2937', lineHeight: 1.15 }}>
          {valor}
        </Typography>
        <Typography sx={{ fontSize: 12, color: '#6b7280' }}>{texto}</Typography>
      </Box>
    </Box>
  );
}

function EtiquetaCategoria({ categoria }) {
  const obrigatorio = categoria === 'Obrigatório';

  return (
    <Chip
      label={categoria}
      size="small"
      sx={{
        height: 24,
        bgcolor: obrigatorio ? '#fff4e5' : '#eef4f1',
        color: obrigatorio ? '#9a6700' : '#486859',
        fontSize: 11,
        fontWeight: 600,
      }}
    />
  );
}

function CardTreinamento({ treinamento }) {
  const atrasado = treinamento.prazo.startsWith('Atrasado');

  return (
    <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, flexDirection: { xs: 'column', sm: 'row' }, px: 2.5, py: 2, borderTop: '1px solid #eef2f0' }}>
      <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: atrasado ? '#fdeceb' : '#eaf6ef', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {atrasado ? <WarningAmberRoundedIcon sx={{ color: '#b42318' }} fontSize="small" /> : <ScheduleOutlinedIcon sx={{ color: '#1e5139' }} fontSize="small" />}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>{treinamento.titulo}</Typography>
          <EtiquetaCategoria categoria={treinamento.categoria} />
        </Box>
        <Typography sx={{ fontSize: 12, color: atrasado ? '#b42318' : '#6b7280' }}>{treinamento.prazo}</Typography>
      </Box>
      <Button
        component={Link}
        to={`/colaborador/treinamentos/${treinamento.id}`}
        variant={atrasado ? 'contained' : 'outlined'}
        size="small"
        endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: '16px !important' }} />}
        sx={{ minWidth: 108, height: 34, borderColor: '#b9d8c7', color: atrasado ? 'white' : '#1e5139', bgcolor: atrasado ? '#1e5139' : 'transparent' }}
      >
        {treinamento.acao}
      </Button>
    </Box>
  );
}

function CardAndamento({ treinamento }) {
  return (
    <Box sx={{ bgcolor: 'white', borderRadius: '12px', p: 2.5, boxShadow: '0 1px 2px rgba(17, 47, 33, 0.06)' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 2 }}>
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1f2937', mb: 0.75 }}>{treinamento.titulo}</Typography>
          <EtiquetaCategoria categoria={treinamento.categoria} />
        </Box>
        <PlayCircleOutlineRoundedIcon sx={{ color: '#1e5139' }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
        <Typography sx={{ fontSize: 12, color: '#6b7280' }}>{treinamento.etapa}</Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#1e5139' }}>{treinamento.percentual}%</Typography>
      </Box>
      <LinearProgress variant="determinate" value={treinamento.percentual} sx={{ height: 6, borderRadius: 4, bgcolor: '#e5efe9', '& .MuiLinearProgress-bar': { bgcolor: '#4c9a70', borderRadius: 4 } }} />
    </Box>
  );
}

function InicioColaborador() {
  const [dashboard, setDashboard] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    dashboardColaborador().then(setDashboard).catch((error) => setErro(error.message));
  }, []);

  if (erro) return <Typography role="alert" color="error">{erro}</Typography>;
  if (!dashboard) return <Typography>Carregando painel...</Typography>;

  const { identity, summary, percentualConcluido } = dashboard;
  const colaborador = { nome: identity.nome };
  const resumoColaborador = {
    percentual: percentualConcluido,
    pendentes: summary.aFazer,
    emAndamento: summary.emAndamento,
    concluidos: summary.concluidos,
    atrasados: summary.atrasados,
  };
  const treinamentosAtencao = dashboard.attention.map((item) => ({
    ...item,
    prazo: item.tipo === 'atrasado' ? `Atrasado há ${item.dias} dias` : `Vence em ${item.dias} dias`,
    acao: item.status === 'em_andamento' ? 'Continuar' : 'Iniciar',
  }));
  const treinamentosEmAndamento = dashboard.emAndamento.map((item) => ({ ...item, percentual: 0, etapa: 'Em andamento', acao: 'Continuar' }));
  const treinamentosBloqueados = dashboard.bloqueados || [];
  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: { xs: 22, sm: 26 }, fontWeight: 700, color: '#112f21' }}>
          Olá, {colaborador.nome.split(' ')[0]}!
        </Typography>
        <Typography sx={{ fontSize: 14, color: '#6b7280', mt: 0.5 }}>
          Acompanhe seus treinamentos e continue avançando.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 3, bgcolor: '#1e5139', borderRadius: '16px', p: { xs: 2.5, sm: 3.5 }, mb: 2.5, overflow: 'hidden', position: 'relative' }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography sx={{ color: '#c9eedd', fontSize: 13, mb: 0.75 }}>Seu progresso geral</Typography>
          <Typography sx={{ color: 'white', fontSize: 30, lineHeight: 1.15, fontWeight: 700 }}>{resumoColaborador.percentual}% concluído</Typography>
          <Typography sx={{ color: '#c9eedd', fontSize: 13, mt: 0.75 }}>Você está no caminho certo. Continue assim!</Typography>
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 280 }, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ color: '#eff6ff', fontSize: 12 }}>Progresso dos treinamentos</Typography>
            <Typography sx={{ color: '#eff6ff', fontSize: 12, fontWeight: 600 }}>{resumoColaborador.percentual}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={resumoColaborador.percentual} sx={{ height: 8, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: '#9ce4bc', borderRadius: 5 } }} />
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }, gap: 1.5, mb: 3.5 }}>
        {cartoesResumo.map((cartao) => <CartaoResumo key={cartao.chave} {...cartao} valor={resumoColaborador[cartao.chave]} />)}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.15fr) minmax(360px, 0.85fr)' }, gap: 2.5, mb: 2.5 }}>
        <Box sx={{ bgcolor: 'white', borderRadius: '12px', boxShadow: '0 1px 2px rgba(17, 47, 33, 0.06)', overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, px: 2.5, pt: 2.5, pb: 1.5 }}>
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Atenção necessária</Typography>
              <Typography sx={{ fontSize: 12, color: '#6b7280', mt: 0.5 }}>Treinamentos que precisam da sua atenção</Typography>
            </Box>
            <WarningAmberRoundedIcon sx={{ color: '#b7791f' }} fontSize="small" />
          </Box>
          {treinamentosAtencao.map((treinamento) => <CardTreinamento key={treinamento.id} treinamento={treinamento} />)}
        </Box>

        <Box sx={{ bgcolor: 'white', borderRadius: '12px', boxShadow: '0 1px 2px rgba(17, 47, 33, 0.06)', overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, px: 2.5, pt: 2.5, pb: 1.5 }}>
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Continue de onde parou</Typography>
              <Typography sx={{ fontSize: 12, color: '#6b7280', mt: 0.5 }}>Retome seus treinamentos em andamento</Typography>
            </Box>
            <PlayCircleOutlineRoundedIcon sx={{ color: '#1e5139' }} fontSize="small" />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, px: 2.5, pb: 2.5 }}>
            {treinamentosEmAndamento.map((treinamento) => <CardAndamento key={treinamento.id} treinamento={treinamento} />)}
          </Box>
        </Box>
      </Box>

      <Box sx={{ bgcolor: 'white', borderRadius: '12px', boxShadow: '0 1px 2px rgba(17, 47, 33, 0.06)', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, px: 2.5, pt: 2.5, pb: 1.5 }}>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Treinamentos bloqueados</Typography>
            <Typography sx={{ fontSize: 12, color: '#6b7280', mt: 0.5 }}>Conclua os pré-requisitos para liberar novos conteúdos</Typography>
          </Box>
          <LockOutlinedIcon sx={{ color: '#6b7280' }} fontSize="small" />
        </Box>
        {treinamentosBloqueados.map((treinamento) => (
          <Box key={treinamento.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2.5, py: 2, borderTop: '1px solid #eef2f0' }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#f1f4f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LockOutlinedIcon sx={{ color: '#738278' }} fontSize="small" />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{treinamento.titulo}</Typography>
              <Typography sx={{ fontSize: 12, color: '#6b7280', mt: 0.25 }}>Pré-requisito: {treinamento.preRequisito}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default InicioColaborador;
