import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { CabecalhoPagina, EtiquetaStatus, containerCard } from '../../components/admin/ElementosAdmin';
import { useTreinamentosColaborador } from '../../components/colaborador/AreaTreinamentos';
import ModalConclusaoTreinamento from '../../components/colaborador/ModalConclusaoTreinamento';
import VideoTreinamento from '../../components/colaborador/VideoTreinamento';
import { estaBloqueado, formatarDataTreinamento, prazoVencido, situacaoTreinamento } from '../../utils/treinamentosColaborador';

function ConteudoTreinamento({ treinamento }) {
  const { treinamentos, dispatch, concluir } = useTreinamentosColaborador();
  const [modalAberto, setModalAberto] = useState(false);
  const navigate = useNavigate();
  const bloqueado = estaBloqueado(treinamento, treinamentos);
  const requisito = treinamentos.find((item) => item.id === treinamento.preRequisitoId);
  const concluido = treinamento.status === 'concluido';

  async function confirmar(aceitou) {
    await concluir(treinamento.id, aceitou);
    navigate('/colaborador/treinamentos');
  }

  return (
    <>
      <CabecalhoPagina titulo={treinamento.titulo} descricao="Assista ao conteúdo e confirme a conclusão ao terminar." />
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>
        <EtiquetaStatus label={treinamento.obrigatorio ? 'Obrigatório' : 'Não obrigatório'} tipo={treinamento.obrigatorio ? 'warning' : 'neutral'} />
        <EtiquetaStatus {...situacaoTreinamento(treinamento, treinamentos)} />
        <Typography sx={{ fontSize: 13, color: prazoVencido(treinamento) ? '#b42318' : '#6b7280' }}>Prazo: {formatarDataTreinamento(treinamento.prazo)}{prazoVencido(treinamento) ? ' · Prazo vencido' : ''}</Typography>
      </Box>
      {bloqueado ? (
        <Alert severity="warning">
          Conclua {requisito ? `“${requisito.titulo}”` : 'o pré-requisito'} para liberar este treinamento.
          {requisito && <Box sx={{ mt: 1 }}><Button component={Link} to={`/colaborador/treinamentos/${requisito.id}`} color="inherit">Ver pré-requisito</Button></Box>}
        </Alert>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.45fr) minmax(300px, 0.55fr)' }, gap: 2.5, alignItems: 'start' }}>
          <Box sx={{ ...containerCard, p: { xs: 2, sm: 3 } }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1f2937', mb: 1.5 }}>Conteúdo do treinamento</Typography>
            <VideoTreinamento videoId={treinamento.videoId} onIniciar={() => dispatch({ tipo: 'iniciar', id: treinamento.id })} onTerminar={() => dispatch({ tipo: 'videoFinalizado', id: treinamento.id })} />
            <Typography sx={{ fontSize: 12, color: '#6b7280', mt: 1.5 }}>Assista ao vídeo até o final para habilitar a confirmação de conclusão.</Typography>
            {concluido ? (
              <Alert severity="success" sx={{ mt: 3 }}>Treinamento concluído em {formatarDataTreinamento(treinamento.concluidoEm)}. Você pode rever o vídeo quando quiser.</Alert>
            ) : (
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, borderTop: '1px solid #eef2f0', mt: 3, pt: 2.5 }}>
                <Typography role="status" sx={{ color: '#486859', fontSize: 14 }}>
                  {treinamento.videoFinalizado ? 'Vídeo finalizado. Confirme sua participação para concluir.' : 'O botão de finalizar será liberado quando o vídeo terminar.'}
                </Typography>
                <Button variant="contained" startIcon={<CheckCircleOutlineRoundedIcon />} disabled={!treinamento.videoFinalizado} onClick={() => setModalAberto(true)} sx={{ flexShrink: 0, minHeight: 40 }}>Finalizar treinamento</Button>
              </Box>
            )}
          </Box>

          <Box sx={{ ...containerCard, p: { xs: 2, sm: 2.5 } }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1f2937', mb: 2 }}>Informações do treinamento</Typography>
            <Typography sx={{ fontSize: 14, color: '#486859', lineHeight: 1.7, mb: 2.5 }}>{treinamento.descricao}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                <DescriptionOutlinedIcon sx={{ color: '#1e5139', mt: 0.25 }} fontSize="small" />
                <Box><Typography sx={{ fontSize: 11, color: '#6b7280' }}>Objetivo</Typography><Typography sx={{ fontSize: 13, color: '#1f2937', mt: 0.25 }}>{treinamento.objetivo}</Typography></Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                <VerifiedOutlinedIcon sx={{ color: '#1e5139', mt: 0.25 }} fontSize="small" />
                <Box><Typography sx={{ fontSize: 11, color: '#6b7280' }}>CA relacionado</Typography><Typography sx={{ fontSize: 13, color: '#1f2937', mt: 0.25 }}>{treinamento.ca}</Typography></Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                <AccessTimeRoundedIcon sx={{ color: '#1e5139', mt: 0.25 }} fontSize="small" />
                <Box><Typography sx={{ fontSize: 11, color: '#6b7280' }}>Duração</Typography><Typography sx={{ fontSize: 13, color: '#1f2937', mt: 0.25 }}>{treinamento.duracao}</Typography></Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      {modalAberto && <ModalConclusaoTreinamento titulo={treinamento.titulo} onClose={() => setModalAberto(false)} onConfirmar={confirmar} />}
    </>
  );
}

function TreinamentoColaborador() {
  const { id } = useParams();
  const { treinamentos } = useTreinamentosColaborador();
  const treinamento = treinamentos.find((item) => item.id === id);

  return (
    <>
      <Button component={Link} to="/colaborador/treinamentos" startIcon={<ArrowBackRoundedIcon />} sx={{ mb: 2 }}>Voltar para meus treinamentos</Button>
      {treinamento ? <ConteudoTreinamento key={treinamento.id} treinamento={treinamento} /> : <Alert severity="warning">Treinamento não encontrado. Volte à lista e selecione um treinamento disponível.</Alert>}
    </>
  );
}

export default TreinamentoColaborador;
