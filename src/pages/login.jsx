import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PainelLogin from '../components/PainelLogin';
import { login } from '../services/api';

function formatarCpf(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function Login() {
  const [perfil, setPerfil] = useState('colaborador');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [manterConectado, setManterConectado] = useState(false);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      const resposta = await login(cpf, senha, perfil);
      const esperadoAdmin = perfil === 'administrador';
      if (esperadoAdmin && !resposta.identity.isAdmin) {
        throw new Error('Este CPF não possui acesso de administrador.');
      }
      localStorage.setItem('token', resposta.token);
      localStorage.setItem('identity', JSON.stringify(resposta.identity));
      navigate(esperadoAdmin ? '/admin' : '/colaborador');
    } catch (error) {
      setErro(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <PainelLogin />

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Box sx={{ display: 'flex', gap: '4px', p: '4px', bgcolor: '#f0f9f5', borderRadius: '10px', mb: 3 }}>
            {['colaborador', 'administrador'].map((opcao) => (
              <Box
                key={opcao}
                component="button"
                type="button"
                onClick={() => setPerfil(opcao)}
                sx={{
                  flex: 1,
                  py: 1,
                  cursor: 'pointer',
                  border: perfil === opcao ? '1px solid #e2efe9' : '1px solid transparent',
                  borderRadius: '6px',
                  bgcolor: perfil === opcao ? 'white' : 'transparent',
                  color: perfil === opcao ? '#112f21' : '#4a695b',
                  fontFamily: 'inherit',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {opcao === 'colaborador' ? 'Colaborador' : 'Administrador'}
              </Box>
            ))}
          </Box>

          <Typography variant="h1">Entrar</Typography>
          <Typography variant="body1" sx={{ mt: 0.5, mb: 3 }}>
            Faça login com seu CPF e senha
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'text.secondary', mb: 1 }}>
              CPF
            </Typography>
            <TextField
              value={cpf}
              onChange={(event) => setCpf(formatarCpf(event.target.value))}
              placeholder="000.000.000-00"
              fullWidth
              required
              autoFocus
              inputProps={{ inputMode: 'numeric', maxLength: 14 }}
            />

            <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'text.secondary', mt: 2, mb: 1 }}>
              Senha
            </Typography>
            <TextField
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Digite sua senha"
              fullWidth
              required
            />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={manterConectado}
                    onChange={(event) => setManterConectado(event.target.checked)}
                    size="small"
                  />
                }
                label="Manter conectado"
                sx={{ m: 0, '& .MuiFormControlLabel-label': { fontSize: 14, color: 'text.secondary' } }}
              />
              <Link component="button" type="button" underline="none" sx={{ fontSize: 14, fontWeight: 600 }}>
                Esqueci minha senha
              </Link>
            </Box>

            <Button type="submit" variant="contained" fullWidth sx={{ height: 40 }}>
              {enviando ? 'Entrando...' : 'Entrar'}
            </Button>
            {erro && <Typography role="alert" sx={{ color: '#b42318', fontSize: 13, mt: 1.5 }}>{erro}</Typography>}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
