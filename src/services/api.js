const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    // Token ausente, expirado ou revogado: encerra a sessão local e volta ao login.
    if (response.status === 401 && token) {
      localStorage.removeItem('token');
      localStorage.removeItem('identity');
      window.location.assign('/');
    }
    const body = await response.json().catch(() => ({}));
    const primeiroErroDeCampo = body.errors && Object.values(body.errors)[0]?.[0];
    throw new Error(primeiroErroDeCampo || body.message || 'Não foi possível concluir a solicitação.');
  }

  return response.status === 204 ? null : response.json();
}

export { API_URL, request };
export const login = (cpf, senha, perfil) => request('/login', { method: 'POST', body: JSON.stringify({ cpf, senha, perfil }) });
export const dashboardAdmin = () => request('/dashboard/admin');
export const dashboardColaborador = () => request('/dashboard/colaborador');
export const logout = () => request('/logout', { method: 'POST' });
export const listarTreinamentos = () => request('/treinamentos');
export const criarTreinamento = (dados) => request('/treinamentos', { method: 'POST', body: JSON.stringify(dados) });
export const atualizarTreinamento = (id, dados) => request(`/treinamentos/${id}`, { method: 'PATCH', body: JSON.stringify(dados) });
export const inativarTreinamento = (id) => request(`/treinamentos/${id}`, { method: 'DELETE' });
