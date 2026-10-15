import { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import { concluirMeuTreinamento, iniciarMeuTreinamento, listarMeusTreinamentos } from '../../services/api';
import { atualizarTreinamentos, erroConclusao } from '../../utils/treinamentosColaborador';
import { meuTreinamentoDaApi } from '../../utils/treinamentosApi';

const ContextoTreinamentos = createContext(null);

export function useTreinamentosColaborador() {
  return useContext(ContextoTreinamentos);
}

// Mostra carregando ou erro (com nova tentativa) no lugar das telas que dependem da lista.
export function AguardarTreinamentos({ children }) {
  const { carregando, erro, recarregar } = useTreinamentosColaborador();

  if (carregando) return <Box role="status" sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress aria-label="Carregando treinamentos" /></Box>;
  if (erro) return <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => recarregar()}>Tentar novamente</Button>}>{erro}</Alert>;
  return children;
}

function AreaTreinamentos() {
  const [treinamentos, dispatch] = useReducer(atualizarTreinamentos, []);
  const [estado, setEstado] = useState({ carregando: true, erro: '' });
  const [mensagem, setMensagem] = useState('');

  // "silencioso" atualiza a lista sem trocar a tela por um indicador de carregamento.
  const carregar = useCallback(async ({ silencioso = false } = {}) => {
    if (!silencioso) setEstado({ carregando: true, erro: '' });
    try {
      const resposta = await listarMeusTreinamentos();
      dispatch({ tipo: 'carregar', treinamentos: resposta.data.map(meuTreinamentoDaApi) });
      setEstado({ carregando: false, erro: '' });
    } catch (error) {
      setEstado({ carregando: false, erro: error.message });
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  // O player avisa a cada "play"; só o primeiro (treinamento ainda pendente) vai ao servidor.
  async function iniciar(id) {
    const treinamento = treinamentos.find((item) => item.id === id);
    if (treinamento?.status !== 'pendente') return;
    try {
      await iniciarMeuTreinamento(id);
      dispatch({ tipo: 'iniciar', id });
    } catch {
      // Assistir continua possível; se o servidor estiver fora, a conclusão acusará o erro.
    }
  }

  async function concluir(id, aceitou) {
    const treinamento = treinamentos.find((item) => item.id === id);
    if (treinamento?.status === 'concluido') return;
    const erro = erroConclusao(treinamento, treinamentos, aceitou);
    if (erro) throw new Error(erro);
    await concluirMeuTreinamento(id);
    setMensagem('Treinamento concluído.');
    await carregar({ silencioso: true });
  }

  function fecharMensagem(_, motivo) {
    if (motivo !== 'clickaway') setMensagem('');
  }

  return (
    <ContextoTreinamentos.Provider value={{ treinamentos, dispatch, iniciar, concluir, recarregar: carregar, ...estado }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
        <Outlet />
      </Box>
      <Snackbar open={Boolean(mensagem)} autoHideDuration={6000} onClose={fecharMensagem}>
        <Alert severity="success" variant="filled" onClose={fecharMensagem}>{mensagem}</Alert>
      </Snackbar>
    </ContextoTreinamentos.Provider>
  );
}

export default AreaTreinamentos;
