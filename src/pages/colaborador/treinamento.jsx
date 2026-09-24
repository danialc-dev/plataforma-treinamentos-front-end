import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
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
        <Box sx={{ ...containerCard, p: { xs: 2, sm: 3 } }}>
          <VideoTreinamento videoId={treinamento.videoId} onIniciar={() => dispatch({ tipo: 'iniciar', id: treinamento.id })} onTerminar={() => dispatch({ tipo: 'videoFinalizado', id: treinamento.id })} />
          <Typography sx={{ fontSize: 12, color: '#6b7280', mt: 1.5 }}>Vídeo de exemplo do YouTube. O conteúdo definitivo do treinamento será fornecido pela equipe.</Typography>
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
