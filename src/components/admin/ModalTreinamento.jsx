import { useId, useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { criaCiclo, validarTreinamento } from '../../utils/treinamentos';
import SecaoGrupos from './SecaoGrupos';

function ModalTreinamento({ treinamento, treinamentos, onClose, onSalvar }) {
  const id = useId();
  const editando = Boolean(treinamento);
  const [valores, setValores] = useState({ nome: treinamento?.nome ?? '', descricao: treinamento?.descricao ?? '', tipo: treinamento?.tipo ?? 'online', videoUrl: treinamento?.videoUrl ?? '', obrigatorio: treinamento?.obrigatorio ?? true, prazoDias: treinamento?.prazoDias ?? '', preRequisitoId: treinamento?.preRequisitoId ?? '', grupoIds: treinamento?.grupoIds ?? [] });
  const [erros, setErros] = useState({});
  const [erroEnvio, setErroEnvio] = useState('');
  const [enviando, setEnviando] = useState(false);
  const envioEmCurso = useRef(false);
  const nomeRef = useRef(null);
  const tipoRef = useRef(null);
  const videoRef = useRef(null);
  const prazoRef = useRef(null);
  const requisitoRef = useRef(null);
  const opcoes = treinamentos.filter((item) => item.ativo && !criaCiclo(treinamentos, treinamento?.id, item.id));

  function alterar(campo, valor) {
    setValores((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => ({ ...atual, [campo]: undefined }));
    setErroEnvio('');
  }
  function fechar() { if (!envioEmCurso.current) onClose(); }
  async function salvar(event) {
    event.preventDefault();
    if (envioEmCurso.current) return;
    const validacao = validarTreinamento(valores, treinamentos, treinamento?.id);
    setErros(validacao);
    if (Object.keys(validacao).length) {
      const ordem = [['nome', nomeRef], ['tipo', tipoRef], ['videoUrl', videoRef], ['prazoDias', prazoRef], ['preRequisitoId', requisitoRef]];
      ordem.find(([campo]) => validacao[campo])?.[1].current?.focus();
      return;
    }
    envioEmCurso.current = true;
    setEnviando(true);
    setErroEnvio('');
    try {
      await onSalvar({ nome: valores.nome.trim(), descricao: valores.descricao.trim(), tipo: valores.tipo, videoUrl: valores.videoUrl.trim(), obrigatorio: valores.obrigatorio, prazoDias: Number(valores.prazoDias), preRequisitoId: valores.preRequisitoId || null, grupoIds: valores.grupoIds });
      onClose();
    } catch (error) { setErroEnvio(error.message || 'Não foi possível salvar. Tente novamente.'); }
    finally { envioEmCurso.current = false; setEnviando(false); }
  }

  return (
    <Dialog open onClose={fechar} fullWidth maxWidth="md" aria-labelledby={`${id}-titulo`} aria-describedby={`${id}-descricao`} slotProps={{ paper: { component: 'form', onSubmit: salvar, noValidate: true, sx: { borderRadius: '16px', m: { xs: 2, sm: 4 }, width: { xs: 'calc(100% - 32px)', sm: '100%' } } } }}>
      <DialogTitle id={`${id}-titulo`} sx={{ pr: 7, fontSize: 22, fontWeight: 700 }}>{editando ? 'Editar treinamento' : 'Criar treinamento'}</DialogTitle>
      <IconButton onClick={fechar} disabled={enviando} aria-label="Fechar formulário" sx={{ position: 'absolute', right: 14, top: 14 }}><CloseRoundedIcon /></IconButton>
      <DialogContent sx={{ pb: 3 }}>
        <DialogContentText id={`${id}-descricao`} sx={{ fontSize: 14, mb: 3 }}>{editando ? 'Atualize as informações do treinamento selecionado.' : 'Defina as informações do novo treinamento.'}</DialogContentText>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 0.5 }}>
          <TextField id={`${id}-nome`} label="Título do treinamento" placeholder="Ex.: Segurança no trabalho" value={valores.nome} onChange={(event) => alterar('nome', event.target.value)} inputRef={nomeRef} required autoFocus fullWidth disabled={enviando} error={Boolean(erros.nome)} helperText={erros.nome} />
          <TextField id={`${id}-descricao`} label="Descrição" placeholder="Sobre o que é este treinamento?" value={valores.descricao} onChange={(event) => alterar('descricao', event.target.value)} multiline minRows={3} fullWidth disabled={enviando} helperText="Opcional." />
          <TextField id={`${id}-tipo`} label="Tipo" select required fullWidth disabled={enviando} value={valores.tipo} onChange={(event) => alterar('tipo', event.target.value)} inputRef={tipoRef} error={Boolean(erros.tipo)} helperText={erros.tipo || 'Treinamentos presenciais terão regras próprias (endereço, presença) e ficarão disponíveis em breve.'}>
            <MenuItem value="online">Online</MenuItem>
            <MenuItem value="presencial" disabled>Presencial — em breve</MenuItem>
          </TextField>
          <TextField id={`${id}-video`} label="Link do vídeo (YouTube)" placeholder="https://www.youtube.com/watch?v=..." type="url" value={valores.videoUrl} onChange={(event) => alterar('videoUrl', event.target.value)} inputRef={videoRef} required={valores.tipo === 'online'} fullWidth disabled={enviando} error={Boolean(erros.videoUrl)} helperText={erros.videoUrl || 'Cole o endereço do vídeo que o colaborador vai assistir.'} />
          <TextField id={`${id}-categoria`} label="Categoria" select fullWidth disabled={enviando} value={valores.obrigatorio ? 'obrigatorio' : 'nao'} onChange={(event) => alterar('obrigatorio', event.target.value === 'obrigatorio')} helperText="Obrigatório ou não obrigatório para os colaboradores.">
            <MenuItem value="obrigatorio">Obrigatório</MenuItem>
            <MenuItem value="nao">Não obrigatório</MenuItem>
          </TextField>
          <TextField id={`${id}-prazo`} label="Prazo de conclusão (dias)" type="number" value={valores.prazoDias} onChange={(event) => alterar('prazoDias', event.target.value)} inputRef={prazoRef} required fullWidth disabled={enviando} slotProps={{ htmlInput: { min: 1, step: 1, inputMode: 'numeric' } }} error={Boolean(erros.prazoDias)} helperText={erros.prazoDias || 'Tempo máximo, em dias, que a pessoa tem para concluir o treinamento.'} />
          <TextField id={`${id}-requisito`} label="Pré-requisito" select fullWidth disabled={enviando} slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }} value={valores.preRequisitoId} onChange={(event) => alterar('preRequisitoId', event.target.value)} inputRef={requisitoRef} error={Boolean(erros.preRequisitoId)} helperText={erros.preRequisitoId || 'Opcional. Treinamento que deve ser concluído antes deste.'}>
            <MenuItem value="">Sem pré-requisito</MenuItem>
            {valores.preRequisitoId && !opcoes.some((item) => item.id === valores.preRequisitoId) && <MenuItem value={valores.preRequisitoId} disabled>Pré-requisito indisponível — selecione outro</MenuItem>}
            {opcoes.map((item) => <MenuItem key={item.id} value={item.id} sx={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}>{item.nome}</MenuItem>)}
          </TextField>
          <SecaoGrupos selecionados={valores.grupoIds} onAlterar={(grupoIds) => alterar('grupoIds', grupoIds)} desabilitado={enviando} />
          {erroEnvio && <Alert severity="error">{erroEnvio}</Alert>}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eef2f0', gap: 1, flexWrap: 'wrap' }}><Button onClick={fechar} disabled={enviando} color="inherit">Cancelar</Button><Button type="submit" variant="contained" disabled={enviando} sx={{ minHeight: 40 }}>{enviando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Criar treinamento'}</Button></DialogActions>
    </Dialog>
  );
}
export default ModalTreinamento;
