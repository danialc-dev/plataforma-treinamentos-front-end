import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { CartaoResumo, CabecalhoPagina, EtiquetaStatus, containerCard } from '../../components/admin/ElementosAdmin';
import { useTreinamentosColaborador } from '../../components/colaborador/AreaTreinamentos';
import { estaBloqueado, situacaoTreinamento } from '../../utils/treinamentosColaborador';

function ProgressoColaborador() {
  const { treinamentos } = useTreinamentosColaborador();
  const concluidos = treinamentos.filter((item) => item.status === 'concluido').length;
  const emAndamento = treinamentos.filter((item) => item.status === 'em_andamento').length;
  const bloqueados = treinamentos.filter((item) => estaBloqueado(item, treinamentos)).length;
  const pendentes = treinamentos.filter((item) => item.status === 'pendente' && !estaBloqueado(item, treinamentos)).length;
  const percentualGeral = treinamentos.length ? Math.round(treinamentos.reduce((total, item) => total + (item.percentual || 0), 0) / treinamentos.length) : 0;
  const obrigatorios = treinamentos.filter((item) => item.obrigatorio);
  const obrigatoriosConcluidos = obrigatorios.length > 0 && obrigatorios.every((item) => item.status === 'concluido');
  const conquistas = [
    { titulo: 'Primeiro passo', descricao: 'Conclua seu primeiro treinamento.', desbloqueada: concluidos >= 1 },
    { titulo: 'Ritmo constante', descricao: 'Conclua dois treinamentos.', desbloqueada: concluidos >= 2 },
    { titulo: 'Segurança em dia', descricao: 'Conclua todos os treinamentos obrigatórios.', desbloqueada: obrigatoriosConcluidos },
    { titulo: 'Trilha completa', descricao: 'Conclua todos os treinamentos.', desbloqueada: treinamentos.length > 0 && concluidos === treinamentos.length },
  ];

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
      <CabecalhoPagina titulo="Meu progresso" descricao="Acompanhe sua evolução nos treinamentos atribuídos." />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' }, gap: 1.5, mb: 3.5 }}>
        <CartaoResumo valor={`${percentualGeral}%`} texto="Progresso geral" Icone={TrendingUpRoundedIcon} />
        <CartaoResumo valor={concluidos} texto="Concluídos" Icone={CheckCircleOutlineRoundedIcon} cor="#2f855a" fundo="#eaf6ef" />
        <CartaoResumo valor={emAndamento} texto="Em andamento" Icone={AssignmentTurnedInOutlinedIcon} cor="#176b52" fundo="#e5f5ef" />
        <CartaoResumo valor={pendentes + bloqueados} texto="Pendentes" Icone={ScheduleOutlinedIcon} cor="#9a6700" fundo="#fff4e5" />
      </Box>

      <Box sx={{ ...containerCard, p: { xs: 2, sm: 2.5 }, mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
          <EmojiEventsRoundedIcon sx={{ color: '#c58b19' }} />
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Conquistas</Typography>
            <Typography sx={{ fontSize: 12, color: '#6b7280', mt: 0.5 }}>Complete treinamentos para desbloquear novos troféus.</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }, gap: 1.5 }}>
          {conquistas.map((conquista) => (
            <Box key={conquista.titulo} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: 1.5, border: '1px solid', borderColor: conquista.desbloqueada ? '#c9eedd' : '#e2efe9', borderRadius: '10px', bgcolor: conquista.desbloqueada ? '#f1fbf5' : '#fafcfb', opacity: conquista.desbloqueada ? 1 : 0.7 }}>
              <EmojiEventsRoundedIcon sx={{ color: conquista.desbloqueada ? '#c58b19' : '#aebbb3', fontSize: 30 }} />
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#1f2937' }}>{conquista.titulo}</Typography>
                <Typography sx={{ fontSize: 11, color: '#6b7280', mt: 0.25 }}>{conquista.descricao}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ ...containerCard, overflow: 'hidden' }}>
        <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Progresso por treinamento</Typography>
          <Typography sx={{ fontSize: 12, color: '#6b7280', mt: 0.5 }}>Veja quanto você já avançou em cada atividade.</Typography>
        </Box>

        {treinamentos.map((treinamento) => {
          const bloqueado = estaBloqueado(treinamento, treinamentos);
          const situacao = situacaoTreinamento(treinamento, treinamentos);

          return (
            <Box key={treinamento.id} sx={{ display: 'flex', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, flexDirection: { xs: 'column', md: 'row' }, px: 2.5, py: 2, borderTop: '1px solid #eef2f0' }}>
              <Box sx={{ flex: 1, minWidth: 0, width: { xs: '100%', md: 'auto' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.75 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>{treinamento.titulo}</Typography>
                  <EtiquetaStatus {...situacao} />
                </Box>
                <Typography sx={{ fontSize: 12, color: '#6b7280', mb: 1 }}>{bloqueado ? 'Conclua o pré-requisito para liberar este treinamento.' : treinamento.etapa}</Typography>
                <LinearProgress variant="determinate" value={treinamento.percentual || 0} sx={{ height: 7, borderRadius: 4, bgcolor: '#e5efe9', '& .MuiLinearProgress-bar': { bgcolor: bloqueado ? '#aebbb3' : '#2f855a', borderRadius: 4 } }} />
              </Box>
              <Typography sx={{ minWidth: 52, textAlign: { xs: 'left', md: 'right' }, fontSize: 14, fontWeight: 700, color: bloqueado ? '#68746d' : '#1e5139' }}>{treinamento.percentual || 0}%</Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default ProgressoColaborador;
