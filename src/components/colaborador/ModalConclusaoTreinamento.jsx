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
import Typography from '@mui/material/Typography';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

function ModalConclusaoTreinamento({ titulo, onClose, onConfirmar }) {
  const id = useId();
  const [aceitou, setAceitou] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const envioEmCurso = useRef(false);

  function fechar() {
    if (!envioEmCurso.current) onClose();
  }

  async function confirmar(event) {
    event.preventDefault();
    if (!aceitou || envioEmCurso.current) return;
    envioEmCurso.current = true;
    setEnviando(true);
    setErro('');
    try {
      await onConfirmar(aceitou);
      onClose();
    } catch (error) {
      setErro(error.message || 'Não foi possível concluir o treinamento. Tente novamente.');
    } finally {
      envioEmCurso.current = false;
      setEnviando(false);
    }
  }

  return (
    <Dialog open onClose={fechar} fullWidth maxWidth="sm" aria-labelledby={`${id}-titulo`} aria-describedby={`${id}-descricao`} slotProps={{ paper: { component: 'form', onSubmit: confirmar, sx: { borderRadius: '16px', m: 2, width: 'calc(100% - 32px)' } } }}>
      <DialogTitle id={`${id}-titulo`} sx={{ fontSize: 22, fontWeight: 700, pr: 7 }}>Concluir treinamento</DialogTitle>
      <IconButton aria-label="Fechar confirmação" onClick={fechar} disabled={enviando} sx={{ position: 'absolute', right: 12, top: 12 }}><CloseRoundedIcon /></IconButton>
      <DialogContent>
        <DialogContentText id={`${id}-descricao`} sx={{ fontSize: 14, mb: 2 }}>Leia a declaração e confirme antes de finalizar.</DialogContentText>
        <Box sx={{ border: '1px solid #e2efe9', borderRadius: '10px', p: 2, bgcolor: '#f6faf8' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1f2937', mb: 1, overflowWrap: 'anywhere' }}>{titulo}</Typography>
          <Typography sx={{ fontSize: 14, color: '#486859', lineHeight: 1.7 }}>Declaro que assisti ao vídeo apresentado e desejo registrar a conclusão deste treinamento.</Typography>
          <Typography sx={{ fontSize: 12, color: '#6b7280', mt: 1.5 }}>Texto provisório para demonstração. O termo definitivo será fornecido pela equipe.</Typography>
        </Box>
        <FormControlLabel
          sx={{ mt: 2, mx: 0, alignItems: 'flex-start', '& .MuiFormControlLabel-label': { pt: 1, fontSize: 14, color: '#1f2937' } }}
          control={<Checkbox autoFocus checked={aceitou} disabled={enviando} onChange={(event) => setAceitou(event.target.checked)} />}
          label="Confirmo que assisti ao treinamento e li a declaração acima."
        />
        {erro && <Alert severity="error" sx={{ mt: 2 }}>{erro}</Alert>}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eef2f0', gap: 1, flexWrap: 'wrap' }}>
        <Button onClick={fechar} disabled={enviando} color="inherit">Cancelar</Button>
        <Button type="submit" variant="contained" disabled={!aceitou || enviando}>{enviando ? 'Confirmando...' : 'Confirmar conclusão'}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalConclusaoTreinamento;
