// Vídeo usado na documentação oficial da IFrame API, somente para demonstração.
const videoId = 'M7lc1UVf-VE';

export function criarTreinamentosColaborador(hoje = new Date()) {
  function data(dias) {
    const valor = new Date(hoje);
    valor.setDate(valor.getDate() + dias);
    return `${valor.getFullYear()}-${String(valor.getMonth() + 1).padStart(2, '0')}-${String(valor.getDate()).padStart(2, '0')}`;
  }

  return [
    { id: '1', titulo: 'NR-35 - Trabalho em Altura', obrigatorio: true, prazo: data(3), status: 'em_andamento', videoId, preRequisitoId: null },
    { id: '2', titulo: 'Uso de EPI', obrigatorio: true, prazo: data(-2), status: 'pendente', videoId, preRequisitoId: null },
    { id: '3', titulo: 'Integração de Novos Colaboradores', obrigatorio: true, prazo: data(7), status: 'concluido', concluidoEm: `${data(-1)}T12:00:00`, videoId, preRequisitoId: null },
    { id: '4', titulo: 'Ergonomia no ambiente de trabalho', obrigatorio: false, prazo: data(15), status: 'pendente', videoId, preRequisitoId: null },
    { id: '5', titulo: 'Trabalho com Produtos Químicos', obrigatorio: true, prazo: data(30), status: 'pendente', videoId, preRequisitoId: '2' },
  ];
}
