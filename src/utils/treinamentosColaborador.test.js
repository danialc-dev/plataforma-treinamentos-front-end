import test from 'node:test';
import assert from 'node:assert/strict';
import { criarTreinamentosColaborador } from '../data/treinamentosColaborador.js';
import { atualizarTreinamentos, erroConclusao, estaBloqueado, prazoVencido, situacaoTreinamento } from './treinamentosColaborador.js';

const exemplos = () => criarTreinamentosColaborador(new Date(2026, 8, 24, 12));

test('começar e terminar vídeo não conclui automaticamente', () => {
  const original = exemplos();
  const iniciados = atualizarTreinamentos(original, { tipo: 'iniciar', id: '2' });
  const assistidos = atualizarTreinamentos(iniciados, { tipo: 'videoFinalizado', id: '2' });
  assert.equal(original[1].status, 'pendente');
  assert.equal(iniciados[1].status, 'em_andamento');
  assert.equal(assistidos[1].status, 'em_andamento');
  assert.equal(assistidos[1].videoFinalizado, true);
  assert.equal(assistidos[1].concluidoEm, undefined);
});

test('conclusão exige vídeo terminado e aceite explícito', () => {
  const original = exemplos();
  assert.equal(atualizarTreinamentos(original, { tipo: 'concluir', id: '2', aceitou: true }), original);
  const assistidos = atualizarTreinamentos(original, { tipo: 'videoFinalizado', id: '2' });
  assert.ok(erroConclusao(assistidos[1], assistidos, false));
  assert.equal(atualizarTreinamentos(assistidos, { tipo: 'concluir', id: '2', aceitou: false }), assistidos);
  const finalizados = atualizarTreinamentos(assistidos, { tipo: 'concluir', id: '2', aceitou: true, data: '2026-09-24T12:00:00Z' });
  assert.equal(finalizados[1].status, 'concluido');
  assert.equal(finalizados[1].concluidoEm, '2026-09-24T12:00:00Z');
});

test('treinamento bloqueado não pode iniciar ou finalizar por acesso direto', () => {
  const original = exemplos();
  assert.equal(estaBloqueado(original[4], original), true);
  for (const tipo of ['iniciar', 'videoFinalizado', 'concluir']) {
    assert.equal(atualizarTreinamentos(original, { tipo, id: '5', aceitou: true }), original);
  }
  assert.ok(erroConclusao(original[4], original, true));
});

test('concluir pré-requisito libera dependente sem concluí-lo', () => {
  const assistidos = atualizarTreinamentos(exemplos(), { tipo: 'videoFinalizado', id: '2' });
  const finalizados = atualizarTreinamentos(assistidos, { tipo: 'concluir', id: '2', aceitou: true, data: '2026-09-24T12:00:00Z' });
  assert.equal(estaBloqueado(finalizados[4], finalizados), false);
  assert.equal(finalizados[4].status, 'pendente');
  assert.equal(finalizados[4].videoFinalizado, undefined);
});

test('fim do vídeo de um treinamento não libera conclusão de outro', () => {
  const assistidos = atualizarTreinamentos(exemplos(), { tipo: 'videoFinalizado', id: '2' });
  assert.ok(erroConclusao(assistidos[3], assistidos, true));
  assert.equal(atualizarTreinamentos(assistidos, { tipo: 'concluir', id: '4', aceitou: true }), assistidos);
});

test('rever ou confirmar novamente não altera uma conclusão existente', () => {
  const original = exemplos();
  for (const tipo of ['iniciar', 'videoFinalizado', 'concluir']) {
    assert.equal(atualizarTreinamentos(original, { tipo, id: '3', aceitou: true, data: 'nova-data' }), original);
  }
});

test('id inexistente não altera estado e pré-requisito ausente bloqueia', () => {
  const original = exemplos();
  assert.equal(atualizarTreinamentos(original, { tipo: 'iniciar', id: 'ausente' }), original);
  assert.ok(erroConclusao(undefined, original, true));
  assert.equal(estaBloqueado({ preRequisitoId: 'ausente' }, original), true);
});

test('prazo conta o dia inteiro e conclusão não permanece atrasada', () => {
  const item = { prazo: '2026-09-24', status: 'pendente' };
  assert.equal(prazoVencido(item, new Date(2026, 8, 24, 23, 59, 59)), false);
  assert.equal(prazoVencido(item, new Date(2026, 8, 25)), true);
  assert.equal(prazoVencido({ ...item, status: 'concluido' }, new Date(2026, 8, 25)), false);
  assert.deepEqual(situacaoTreinamento(exemplos()[4], exemplos()), { label: 'Bloqueado', tipo: 'neutral' });
});
