import { useId, useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { criaCiclo, validarTreinamento } from '../../utils/treinamentos';

function ModalTreinamento({ treinamento, treinamentos, onClose, onSalvar }) {
  const id = useId();
  const editando = Boolean(treinamento);
  const [valores, setValores] = useState({ nome: treinamento?.nome ?? '', obrigatorio: treinamento?.obrigatorio ?? true, prazoDias: treinamento?.prazoDias ?? '', preRequisitoId: treinamento?.preRequisitoId ?? '' });
  const [erros, setErros] = useState({});
  const [erroEnvio, setErroEnvio] = useState('');
  const [enviando, setEnviando] = useState(false);
  const envioEmCurso = useRef(false);
  const nomeRef = useRef(null);
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
      const campo = validacao.nome ? nomeRef : validacao.prazoDias ? prazoRef : requisitoRef;
      campo.current?.focus();
      return;
    }
    envioEmCurso.current = true;
    setEnviando(true);
    setErroEnvio('');
    try {
      await onSalvar({ nome: valores.nome.trim(), obrigatorio: valores.obrigatorio, prazoDias: Number(valores.prazoDias), preRequisitoId: valores.preRequisitoId || null });
      onClose();
    } catch (error) { setErroEnvio(error.message || 'Não foi possível salvar. Tente novamente.'); }
    finally { envioEmCurso.current = false; setEnviando(false); }
  }

  return (
    <Dialog open onClose={fechar} fullWidth maxWidth="sm" aria-labelledby={`${id}-titulo`} aria-describedby={`${id}-descricao`} slotProps={{ paper: { component: 'form', onSubmit: salvar, noValidate: true, sx: { borderRadius: '16px', m: { xs: 2, sm: 4 }, width: { xs: 'calc(100% - 32px)', sm: '100%' } } } }}>
      <DialogTitle id={`${id}-titulo`} sx={{ pr: 7, fontSize: 22, fontWeight: 700 }}>{editando ? 'Editar treinamento' : 'Criar treinamento'}</DialogTitle>
      <IconButton onClick={fechar} disabled={enviando} aria-label="Fechar formulário" sx={{ position: 'absolute', right: 14, top: 14 }}><CloseRoundedIcon /></IconButton>
      <DialogContent sx={{ pb: 3 }}>
        <DialogContentText id={`${id}-descricao`} sx={{ fontSize: 14, mb: 3 }}>{editando ? 'Atualize as informações do treinamento selecionado.' : 'Defina as informações do novo treinamento.'}</DialogContentText>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 0.5 }}>
          <TextField id={`${id}-nome`} label="Nome do treinamento" placeholder="Ex.: Segurança no trabalho" value={valores.nome} onChange={(event) => alterar('nome', event.target.value)} inputRef={nomeRef} required autoFocus fullWidth disabled={enviando} error={Boolean(erros.nome)} helperText={erros.nome} />
          <TextField id={`${id}-prazo`} label="Prazo de conclusão (dias)" type="number" value={valores.prazoDias} onChange={(event) => alterar('prazoDias', event.target.value)} inputRef={prazoRef} required fullWidth disabled={enviando} slotProps={{ htmlInput: { min: 1, step: 1, inputMode: 'numeric' } }} error={Boolean(erros.prazoDias)} helperText={erros.prazoDias || 'Informe o prazo em dias inteiros.'} />
          <TextField id={`${id}-requisito`} label="Pré-requisito" select fullWidth disabled={enviando} slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }} value={valores.preRequisitoId} onChange={(event) => alterar('preRequisitoId', event.target.value)} inputRef={requisitoRef} error={Boolean(erros.preRequisitoId)} helperText={erros.preRequisitoId || 'Opcional. Treinamento que deve ser concluído antes deste.'}>
            <MenuItem value="">Sem pré-requisito</MenuItem>
            {valores.preRequisitoId && !opcoes.some((item) => item.id === valores.preRequisitoId) && <MenuItem value={valores.preRequisitoId} disabled>Pré-requisito indisponível — selecione outro</MenuItem>}
            {opcoes.map((item) => <MenuItem key={item.id} value={item.id} sx={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}>{item.nome}</MenuItem>)}
          </TextField>
          <Box sx={{ bgcolor: '#f6faf8', border: '1px solid #e2efe9', borderRadius: '10px', px: 1.5, py: 1 }}><FormControlLabel sx={{ m: 0, '& .MuiFormControlLabel-label': { color: '#1f2937', fontSize: 14, fontWeight: 600 } }} control={<Checkbox checked={valores.obrigatorio} onChange={(event) => alterar('obrigatorio', event.target.checked)} disabled={enviando} />} label="Treinamento obrigatório" /><Typography sx={{ fontSize: 12, color: '#6b7280', pl: 5.25, pb: 0.5 }}>Desmarque para classificar como não obrigatório.</Typography></Box>
          {erroEnvio && <Alert severity="error">{erroEnvio}</Alert>}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eef2f0', gap: 1, flexWrap: 'wrap' }}><Button onClick={fechar} disabled={enviando} color="inherit">Cancelar</Button><Button type="submit" variant="contained" disabled={enviando} sx={{ minHeight: 40 }}>{enviando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Criar treinamento'}</Button></DialogActions>
    </Dialog>
  );
}
export default ModalTreinamento;
