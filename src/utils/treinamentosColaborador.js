export function estaBloqueado(treinamento, treinamentos) {
  return Boolean(treinamento.preRequisitoId && treinamentos.find((item) => item.id === treinamento.preRequisitoId)?.status !== 'concluido');
}

export function erroConclusao(treinamento, treinamentos, aceitou) {
  if (!treinamento) return 'Treinamento não encontrado.';
  if (estaBloqueado(treinamento, treinamentos)) return 'Conclua o pré-requisito antes deste treinamento.';
  if (!treinamento.videoFinalizado) return 'Aguarde o término do vídeo para finalizar.';
  if (aceitou !== true) return 'Marque a confirmação de que assistiu ao treinamento.';
  return '';
}

export function atualizarTreinamentos(treinamentos, acao) {
  const treinamento = treinamentos.find((item) => item.id === acao.id);
  if (!treinamento || treinamento.status === 'concluido' || estaBloqueado(treinamento, treinamentos)) return treinamentos;

  let alteracao;
  if (acao.tipo === 'iniciar') alteracao = { status: 'em_andamento' };
  if (acao.tipo === 'videoFinalizado') alteracao = { status: 'em_andamento', videoFinalizado: true };
  if (acao.tipo === 'concluir' && !erroConclusao(treinamento, treinamentos, acao.aceitou)) {
    alteracao = { status: 'concluido', percentual: 100, etapa: 'Concluído', concluidoEm: acao.data };
  }
  if (!alteracao) return treinamentos;
  return treinamentos.map((item) => item.id === acao.id ? { ...item, ...alteracao } : item);
}

export function situacaoTreinamento(treinamento, treinamentos) {
  if (treinamento.status === 'concluido') return { label: 'Concluído', tipo: 'success' };
  if (estaBloqueado(treinamento, treinamentos)) return { label: 'Bloqueado', tipo: 'neutral' };
  if (treinamento.status === 'em_andamento') return { label: 'Em andamento', tipo: 'warning' };
  return { label: 'A fazer', tipo: 'neutral' };
}

export function formatarDataTreinamento(valor) {
  return new Date(valor.length === 10 ? `${valor}T12:00:00` : valor).toLocaleDateString('pt-BR');
}

export function prazoVencido(treinamento, hoje = new Date()) {
  return treinamento.status !== 'concluido' && new Date(`${treinamento.prazo}T23:59:59.999`) < hoje;
}
