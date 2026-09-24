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
import Typography from '@mui/material/Typography';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

function ModalInativarTreinamento({ treinamento, dependentes, onClose, onConfirmar }) {
  const id = useId();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const envioEmCurso = useRef(false);
  const bloqueado = dependentes.length > 0;
  function fechar() { if (!envioEmCurso.current) onClose(); }
  async function confirmar() {
    if (envioEmCurso.current || bloqueado) return;
    envioEmCurso.current = true; setEnviando(true); setErro('');
    try { await onConfirmar(treinamento.id); onClose(); }
    catch (error) { setErro(error.message || 'Não foi possível inativar. Tente novamente.'); }
    finally { envioEmCurso.current = false; setEnviando(false); }
  }
  return (
    <Dialog open onClose={fechar} fullWidth maxWidth="xs" aria-labelledby={`${id}-titulo`} aria-describedby={`${id}-descricao`} slotProps={{ paper: { sx: { borderRadius: '16px', m: 2, width: 'calc(100% - 32px)' } } }}>
      <DialogTitle id={`${id}-titulo`} sx={{ pr: 6, fontSize: 20, fontWeight: 700 }}>Inativar treinamento?</DialogTitle>
      <IconButton onClick={fechar} disabled={enviando} aria-label="Fechar confirmação" sx={{ position: 'absolute', right: 12, top: 12 }}><CloseRoundedIcon /></IconButton>
      <DialogContent><Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fff4e5', color: '#9a6700', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}><WarningAmberRoundedIcon /></Box><DialogContentText id={`${id}-descricao`} sx={{ fontSize: 14 }}>O treinamento passará a ter o status Inativo. O registro continuará na lista e poderá ser consultado e editado.</DialogContentText><Typography sx={{ my: 2, p: 1.5, borderRadius: '8px', bgcolor: '#f6faf8', color: '#1f2937', fontSize: 14, fontWeight: 600, overflowWrap: 'anywhere' }}>{treinamento.nome}</Typography>{bloqueado && <Alert severity="warning">Antes de inativar, remova ou substitua este pré-requisito nos treinamentos ativos abaixo:<Box component="ul" sx={{ pl: 2, mb: 0, overflowWrap: 'anywhere' }}>{dependentes.map((item) => <li key={item.id}>{item.nome}</li>)}</Box></Alert>}{erro && <Alert severity="error" sx={{ mt: 2 }}>{erro}</Alert>}</DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eef2f0', gap: 1, flexWrap: 'wrap' }}><Button onClick={fechar} disabled={enviando} autoFocus color="inherit">Cancelar</Button><Button onClick={confirmar} variant="contained" color="error" disabled={enviando || bloqueado}>{enviando ? 'Inativando...' : 'Inativar treinamento'}</Button></DialogActions>
    </Dialog>
  );
}
export default ModalInativarTreinamento;
