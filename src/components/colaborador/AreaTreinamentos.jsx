import { createContext, useContext, useReducer, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import { criarTreinamentosColaborador } from '../../data/treinamentosColaborador';
import { atualizarTreinamentos, erroConclusao } from '../../utils/treinamentosColaborador';

const ContextoTreinamentos = createContext(null);

export function useTreinamentosColaborador() {
  return useContext(ContextoTreinamentos);
}

function AreaTreinamentos() {
  const [treinamentos, dispatch] = useReducer(atualizarTreinamentos, undefined, criarTreinamentosColaborador);
  const [mensagem, setMensagem] = useState('');

  function concluir(id, aceitou) {
    const treinamento = treinamentos.find((item) => item.id === id);
    if (treinamento?.status === 'concluido') return;
    const erro = erroConclusao(treinamento, treinamentos, aceitou);
    if (erro) throw new Error(erro);
    dispatch({ tipo: 'concluir', id, aceitou, data: new Date().toISOString() });
    setMensagem('Treinamento concluído nesta demonstração.');
  }

  function fecharMensagem(_, motivo) {
    if (motivo !== 'clickaway') setMensagem('');
  }

  return (
    <ContextoTreinamentos.Provider value={{ treinamentos, dispatch, concluir }}>
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
