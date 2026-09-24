// Vídeo usado na documentação oficial da IFrame API, somente para demonstração.
const videoId = 'M7lc1UVf-VE';

export function criarTreinamentosColaborador(hoje = new Date()) {
  function data(dias) {
    const valor = new Date(hoje);
    valor.setDate(valor.getDate() + dias);
    return `${valor.getFullYear()}-${String(valor.getMonth() + 1).padStart(2, '0')}-${String(valor.getDate()).padStart(2, '0')}`;
  }

  return [
    { id: '1', titulo: 'NR-35 - Trabalho em Altura', descricao: 'Aprenda os principais cuidados e procedimentos para realizar atividades em altura com segurança.', objetivo: 'Reconhecer riscos e aplicar medidas preventivas durante o trabalho em altura.', ca: 'CA 12345', duracao: '12 minutos', obrigatorio: true, prazo: data(3), status: 'em_andamento', percentual: 65, etapa: 'Etapa 3 de 4', videoId, preRequisitoId: null },
    { id: '2', titulo: 'Uso de EPI', descricao: 'Conheça a forma correta de selecionar, utilizar, higienizar e armazenar os equipamentos de proteção individual.', objetivo: 'Utilizar os EPIs de forma correta e segura durante as atividades profissionais.', ca: 'CA 67890', duracao: '10 minutos', obrigatorio: true, prazo: data(-2), status: 'pendente', percentual: 0, etapa: 'Ainda não iniciado', videoId, preRequisitoId: null },
    { id: '3', titulo: 'Integração de Novos Colaboradores', descricao: 'Apresentação da empresa, das regras de convivência e dos principais procedimentos internos.', objetivo: 'Conhecer a empresa e os procedimentos essenciais para iniciar as atividades.', ca: 'Não se aplica', duracao: '15 minutos', obrigatorio: true, prazo: data(7), status: 'concluido', percentual: 100, etapa: 'Concluído', concluidoEm: `${data(-1)}T12:00:00`, videoId, preRequisitoId: null },
    { id: '4', titulo: 'Ergonomia no ambiente de trabalho', descricao: 'Orientações para ajustar o posto de trabalho e prevenir desconfortos e lesões.', objetivo: 'Adotar hábitos e ajustes ergonômicos na rotina de trabalho.', ca: 'Não se aplica', duracao: '8 minutos', obrigatorio: false, prazo: data(15), status: 'pendente', percentual: 18, etapa: 'Etapa 1 de 3', videoId, preRequisitoId: null },
    { id: '5', titulo: 'Trabalho com Produtos Químicos', descricao: 'Boas práticas para manuseio, armazenamento e resposta a incidentes com produtos químicos.', objetivo: 'Identificar perigos e aplicar procedimentos seguros no contato com produtos químicos.', ca: 'CA 24680', duracao: '14 minutos', obrigatorio: true, prazo: data(30), status: 'pendente', percentual: 0, etapa: 'Bloqueado', videoId, preRequisitoId: '2' },
  ];
}
