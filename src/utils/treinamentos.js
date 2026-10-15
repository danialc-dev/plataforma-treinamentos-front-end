import { extrairVideoId } from './youtube.js';

export const TIPOS_TREINAMENTO = { online: 'Online', presencial: 'Presencial' };

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
  if (!Object.hasOwn(TIPOS_TREINAMENTO, valores.tipo)) erros.tipo = 'Selecione o tipo do treinamento.';
  const link = (valores.videoUrl ?? '').trim();
  if (valores.tipo === 'online' && !link) erros.videoUrl = 'Informe o link do vídeo no YouTube.';
  else if (link && !extrairVideoId(link)) erros.videoUrl = 'Informe um link válido de vídeo do YouTube.';
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

// Treinamento inativo só pode voltar a ser ativo se o seu pré-requisito estiver ativo.
export function obterPrerequisitoInativo(treinamentos, treinamento) {
  const requisito = treinamentos.find((item) => item.id === treinamento.preRequisitoId);
  return requisito && !requisito.ativo ? requisito : null;
}
