export const colaborador = {
  nome: 'João Silva',
  empresa: 'Sempher Solutions',
  cpf: '123.456.789-00',
  perfil: 'Colaborador',
};

export const resumoColaborador = {
  percentual: 68,
  pendentes: 4,
  emAndamento: 2,
  concluidos: 8,
  atrasados: 1,
};

export const treinamentosAtencao = [
  {
    id: 1,
    titulo: 'NR-35 - Trabalho em Altura',
    categoria: 'Obrigatório',
    prazo: 'Vence em 3 dias',
    situacao: 'Em andamento',
    percentual: 65,
    acao: 'Continuar',
  },
  {
    id: 2,
    titulo: 'Uso de EPI',
    categoria: 'Obrigatório',
    prazo: 'Atrasado há 2 dias',
    situacao: 'Pendente',
    percentual: 0,
    acao: 'Iniciar',
  },
];

export const treinamentosEmAndamento = [
  {
    id: 3,
    titulo: 'Integração de Novos Colaboradores',
    categoria: 'Obrigatório',
    percentual: 42,
    etapa: 'Etapa 2 de 4',
    acao: 'Continuar',
  },
  {
    id: 4,
    titulo: 'Ergonomia no ambiente de trabalho',
    categoria: 'Não obrigatório',
    percentual: 18,
    etapa: 'Etapa 1 de 3',
    acao: 'Continuar',
  },
];

export const treinamentosBloqueados = [
  {
    id: 5,
    titulo: 'Trabalho com Produtos Químicos',
    preRequisito: 'Uso de EPI',
  },
];
