import { useCallback, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { listarGrupos } from '../../services/api';
import { alternarGrupo } from '../../utils/grupos';

// Seção opcional do formulário de treinamento: "Adicionar a grupos". A lista de grupos só é buscada
// na primeira vez que a seção é aberta.
function SecaoGrupos({ selecionados, onAlterar, desabilitado }) {
  const [estado, setEstado] = useState({ grupos: null, carregando: false, erro: '' });

  const carregar = useCallback(async () => {
    setEstado({ grupos: null, carregando: true, erro: '' });
    try {
      const resposta = await listarGrupos();
      setEstado({ grupos: resposta.data, carregando: false, erro: '' });
    } catch (error) {
      setEstado({ grupos: null, carregando: false, erro: error.message });
    }
  }, []);

  function aoExpandir(_, expandido) {
    if (expandido && estado.grupos === null && !estado.carregando) carregar();
  }

  const { grupos, carregando, erro } = estado;

  return (
    <Accordion disableGutters elevation={0} onChange={aoExpandir} sx={{ border: '1px solid #e2efe9', borderRadius: '10px !important', '&:before': { display: 'none' } }}>
      <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />} aria-controls="grupos-conteudo" id="grupos-cabecalho">
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>
          Adicionar a grupos <Typography component="span" sx={{ fontSize: 13, fontWeight: 400, color: '#6b7280' }}>(opcional)</Typography>
          {selecionados.length > 0 && <Typography component="span" sx={{ ml: 1, fontSize: 12, fontWeight: 600, color: '#1e5139' }}>{selecionados.length} {selecionados.length === 1 ? 'selecionado' : 'selecionados'}</Typography>}
        </Typography>
      </AccordionSummary>
      <AccordionDetails id="grupos-conteudo" sx={{ pt: 0 }}>
        {carregando && <Box role="status" sx={{ display: 'flex', justifyContent: 'center', py: 2 }}><CircularProgress size={24} aria-label="Carregando grupos" /></Box>}
        {erro && <Alert severity="error" action={<Button color="inherit" size="small" onClick={carregar}>Tentar novamente</Button>}>{erro}</Alert>}
        {grupos && grupos.length === 0 && <Typography sx={{ fontSize: 13, color: '#6b7280' }}>Nenhum grupo cadastrado.</Typography>}
        {grupos && grupos.length > 0 && (
          <Box>
            <Typography sx={{ fontSize: 12, color: '#6b7280', mb: 0.5 }}>Marque os grupos em que este treinamento deve entrar. Pode ficar sem nenhum.</Typography>
            {/* Em colunas, para listas longas não crescerem só para baixo: 2 no celular, 3 no tablet e 4 no computador. */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' }, columnGap: 1 }}>
              {grupos.map((grupo) => (
                <FormControlLabel key={grupo.id} label={grupo.nome} disabled={desabilitado} sx={{ mr: 0, '& .MuiFormControlLabel-label': { fontSize: 14, overflowWrap: 'anywhere' } }} control={<Checkbox checked={selecionados.includes(grupo.id)} onChange={() => onAlterar(alternarGrupo(selecionados, grupo.id))} />} />
              ))}
            </Box>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default SecaoGrupos;
