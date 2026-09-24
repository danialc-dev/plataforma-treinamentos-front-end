export function criaCiclo(treinamentos, treinamentoId, preRequisitoId) {
  const visitados = new Set(treinamentoId ? [treinamentoId] : []);
  let atual = preRequisitoId;
  while (atual) {
    if (visitados.has(atual)) return true;
    visitados.add(atual);
    atual = treinamentos.find((item) => item.id === atual)?.preRequisitoId;
  }
  return false;
}

export function validarTreinamento(valores, treinamentos, treinamentoId) {
  const erros = {};
  const prazo = Number(valores.prazoDias);
  if (!valores.nome.trim()) erros.nome = 'Informe o nome do treinamento.';
  if (!Number.isSafeInteger(prazo) || prazo < 1) erros.prazoDias = 'Informe um número inteiro de dias maior que zero.';
  if (valores.preRequisitoId) {
    const requisito = treinamentos.find((item) => item.id === valores.preRequisitoId);
    if (!requisito?.ativo) erros.preRequisitoId = 'Selecione um treinamento ativo.';
    else if (criaCiclo(treinamentos, treinamentoId, valores.preRequisitoId)) erros.preRequisitoId = 'O pré-requisito não pode depender deste treinamento.';
  }
  return erros;
}

export function obterDependentesAtivos(treinamentos, treinamentoId) {
  return treinamentos.filter((item) => item.ativo && item.preRequisitoId === treinamentoId);
}
