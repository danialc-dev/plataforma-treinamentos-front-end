import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { CartaoResumo, CabecalhoPagina, EtiquetaStatus, containerCard } from '../../components/admin/ElementosAdmin';
import ModalTreinamento from '../../components/admin/ModalTreinamento';
import ModalInativarTreinamento from '../../components/admin/ModalInativarTreinamento';
import { treinamentosIniciais } from '../../data/treinamentos';
import { obterDependentesAtivos, validarTreinamento } from '../../utils/treinamentos';

function Treinamentos() {
  const [treinamentos, setTreinamentos] = useState(treinamentosIniciais);
  const [modal, setModal] = useState(null);
  const [notificacao, setNotificacao] = useState(null);
  const selecionado = treinamentos.find((item) => item.id === modal?.id);
  const ativos = treinamentos.filter((item) => item.ativo);
  const nomesPorId = new Map(treinamentos.map((item) => [item.id, item.nome]));

  function notificar(mensagem) {
    setNotificacao({ mensagem, id: crypto.randomUUID() });
  }

  function salvarTreinamento(valores) {
    const erros = validarTreinamento(valores, treinamentos, selecionado?.id);
    if (Object.keys(erros).length) throw new Error(Object.values(erros)[0]);

    if (modal.tipo === 'editar') {
      if (!selecionado) throw new Error('Treinamento não encontrado. Reabra o formulário.');
      setTreinamentos((atuais) => atuais.map((item) => item.id === selecionado.id ? { ...item, ...valores } : item));
      notificar('Treinamento atualizado nesta demonstração.');
    } else {
      const novo = { ...valores, id: crypto.randomUUID(), ativo: true };
      setTreinamentos((atuais) => [...atuais, novo]);
      notificar('Treinamento criado nesta demonstração.');
    }
  }

  function inativarTreinamento(id) {
    if (obterDependentesAtivos(treinamentos, id).length) {
      throw new Error('Este treinamento é pré-requisito de outro treinamento ativo.');
    }
    setTreinamentos((atuais) => atuais.map((item) => item.id === id ? { ...item, ativo: false } : item));
    notificar('Treinamento inativado nesta demonstração.');
  }

  function fecharNotificacao(_, motivo) {
    if (motivo !== 'clickaway') setNotificacao(null);
  }

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
      <CabecalhoPagina titulo="Gestão de treinamentos" descricao={`${treinamentos.length} treinamentos cadastrados`} acao={<Button onClick={() => setModal({ tipo: 'criar' })} variant="contained" startIcon={<AddRoundedIcon />} sx={{ height: 40 }}>Criar treinamento</Button>} />

      <Alert severity="info" sx={{ mb: 2.5, fontSize: 13 }}>
        Demonstração com dados de exemplo. As alterações não são salvas no servidor e serão descartadas ao sair desta página ou recarregá-la.
      </Alert>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 1.5, mb: 3.5 }}>
        <CartaoResumo valor={ativos.length} texto="Treinamentos ativos" Icone={AssignmentOutlinedIcon} />
        <CartaoResumo valor={ativos.filter((item) => item.obrigatorio).length} texto="Obrigatórios ativos" Icone={AssignmentOutlinedIcon} />
        <CartaoResumo valor={ativos.filter((item) => item.preRequisitoId).length} texto="Ativos com pré-requisito" Icone={AssignmentOutlinedIcon} />
      </Box>

      <Box sx={{ ...containerCard, overflow: 'hidden' }}>
        <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}><Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Treinamentos cadastrados</Typography><Typography sx={{ fontSize: 12, color: '#6b7280', mt: 0.5 }}>Gerencie os conteúdos disponíveis para os colaboradores</Typography></Box>
        {treinamentos.map((treinamento) => (
          <Box key={treinamento.id} sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1.5, flexDirection: { xs: 'column', sm: 'row' }, px: 2.5, py: 2, borderTop: '1px solid #eef2f0', '&:hover': { bgcolor: '#f9fbfa' } }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#eaf6ef', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AssignmentOutlinedIcon sx={{ color: '#1e5139' }} fontSize="small" /></Box>
            <Box sx={{ flex: 1, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1f2937', mb: 0.75, overflowWrap: 'anywhere' }}>{treinamento.nome}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <EtiquetaStatus label={treinamento.obrigatorio ? 'Obrigatório' : 'Não obrigatório'} tipo={treinamento.obrigatorio ? 'warning' : 'neutral'} />
                <Typography sx={{ fontSize: 12, color: '#6b7280' }}>Prazo: {treinamento.prazoDias} {treinamento.prazoDias === 1 ? 'dia' : 'dias'}</Typography>
              </Box>
              {treinamento.preRequisitoId && <Typography sx={{ mt: 0.75, fontSize: 12, color: '#6b7280', overflowWrap: 'anywhere' }}>Pré-requisito: {nomesPorId.get(treinamento.preRequisitoId)}</Typography>}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EtiquetaStatus label={treinamento.ativo ? 'Ativo' : 'Inativo'} tipo={treinamento.ativo ? 'success' : 'neutral'} />
              <Tooltip title="Editar treinamento"><IconButton onClick={() => setModal({ tipo: 'editar', id: treinamento.id })} aria-label={`Editar ${treinamento.nome}`} sx={{ width: 40, height: 40 }}><EditOutlinedIcon fontSize="small" sx={{ color: '#6b7280' }} /></IconButton></Tooltip>
              <Tooltip title={treinamento.ativo ? 'Inativar treinamento' : 'Treinamento já inativo'}><span><IconButton onClick={() => setModal({ tipo: 'inativar', id: treinamento.id })} disabled={!treinamento.ativo} aria-label={`Inativar ${treinamento.nome}`} sx={{ width: 40, height: 40 }}><DeleteOutlineRoundedIcon fontSize="small" /></IconButton></span></Tooltip>
            </Box>
          </Box>
        ))}
      </Box>

      {(modal?.tipo === 'criar' || modal?.tipo === 'editar') && <ModalTreinamento treinamento={selecionado} treinamentos={treinamentos} onClose={() => setModal(null)} onSalvar={salvarTreinamento} />}
      {modal?.tipo === 'inativar' && selecionado && <ModalInativarTreinamento treinamento={selecionado} dependentes={obterDependentesAtivos(treinamentos, selecionado.id)} onClose={() => setModal(null)} onConfirmar={inativarTreinamento} />}
      <Snackbar key={notificacao?.id} open={Boolean(notificacao)} autoHideDuration={5000} onClose={fecharNotificacao}><Alert onClose={fecharNotificacao} severity="success" variant="filled" sx={{ width: '100%' }}>{notificacao?.mensagem}</Alert></Snackbar>
    </Box>
  );
}

export default Treinamentos;
