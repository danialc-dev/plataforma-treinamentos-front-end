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
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'Não foi possível concluir a solicitação.');
  }

  return response.status === 204 ? null : response.json();
}

export { API_URL, request };
export const login = (cpf, senha, perfil) => request('/login', { method: 'POST', body: JSON.stringify({ cpf, senha, perfil }) });
export const dashboardAdmin = () => request('/dashboard/admin');
export const dashboardColaborador = () => request('/dashboard/colaborador');
export const logout = () => request('/logout', { method: 'POST' });
