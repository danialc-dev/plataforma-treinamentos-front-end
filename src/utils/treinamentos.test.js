import test from 'node:test';
import assert from 'node:assert/strict';
import { criaCiclo, obterDependentesAtivos, obterPrerequisitoInativo, validarTreinamento } from './treinamentos.js';

const treinamentos = [
  { id: 'a', ativo: true, preRequisitoId: null },
  { id: 'b', ativo: true, preRequisitoId: 'a' },
  { id: 'c', ativo: true, preRequisitoId: 'b' },
  { id: 'd', ativo: false, preRequisitoId: 'a' },
];
const valores = { nome: 'Treinamento', descricao: 'Sobre o treinamento.', tipo: 'online', videoUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE', prazoDias: '30', preRequisitoId: '' };

test('aceita prazo inteiro positivo com ou sem pré-requisito válido', () => {
  assert.deepEqual(validarTreinamento(valores, treinamentos), {});
  assert.deepEqual(validarTreinamento({ ...valores, prazoDias: '1', preRequisitoId: 'c' }, treinamentos), {});
});
test('rejeita nome vazio e prazos vazios, fracionários, negativos ou inválidos', () => {
  assert.ok(validarTreinamento({ ...valores, nome: '   ' }, treinamentos).nome);
  for (const prazoDias of ['', ' ', '0', '-2', '1.5', 'abc', 'Infinity', '9007199254740992']) assert.ok(validarTreinamento({ ...valores, prazoDias }, treinamentos).prazoDias, `Prazo: ${prazoDias}`);
});
test('rejeita pré-requisito inativo ou inexistente', () => {
  for (const preRequisitoId of ['d', 'inexistente']) assert.ok(validarTreinamento({ ...valores, preRequisitoId }, treinamentos).preRequisitoId);
});
test('impede dependência de si mesmo e ciclo indireto, permitindo editar vínculo válido', () => {
  assert.equal(criaCiclo(treinamentos, 'a', 'a'), true);
  assert.equal(criaCiclo(treinamentos, 'a', 'c'), true);
  assert.ok(validarTreinamento({ ...valores, preRequisitoId: 'c' }, treinamentos, 'a').preRequisitoId);
  assert.deepEqual(validarTreinamento({ ...valores, preRequisitoId: 'b' }, treinamentos, 'c'), {});
});
test('somente dependentes ativos diretos impedem a inativação', () => {
  assert.deepEqual(obterDependentesAtivos(treinamentos, 'a').map((item) => item.id), ['b']);
  assert.deepEqual(obterDependentesAtivos(treinamentos, 'c'), []);
});
test('descrição é opcional', () => {
  assert.deepEqual(validarTreinamento({ ...valores, descricao: '' }, treinamentos), {});
  assert.deepEqual(validarTreinamento({ ...valores, descricao: undefined }, treinamentos), {});
});
test('tipo e link do vídeo são validados', () => {
  assert.ok(validarTreinamento({ ...valores, tipo: 'hibrido' }, treinamentos).tipo);
  assert.ok(validarTreinamento({ ...valores, videoUrl: '' }, treinamentos).videoUrl);
  for (const videoUrl of ['abc', 'https://vimeo.com/123', 'https://www.youtube.com/watch?v=curto']) assert.ok(validarTreinamento({ ...valores, videoUrl }, treinamentos).videoUrl, videoUrl);
});
test('treinamento presencial não exige vídeo, mas um link informado precisa ser válido', () => {
  assert.deepEqual(validarTreinamento({ ...valores, tipo: 'presencial', videoUrl: '' }, treinamentos), {});
  assert.ok(validarTreinamento({ ...valores, tipo: 'presencial', videoUrl: 'qualquer coisa' }, treinamentos).videoUrl);
});
test('só ativa de novo se o pré-requisito estiver ativo', () => {
  assert.equal(obterPrerequisitoInativo(treinamentos, { preRequisitoId: 'd' })?.id, 'd');
  assert.equal(obterPrerequisitoInativo(treinamentos, { preRequisitoId: 'a' }), null);
  assert.equal(obterPrerequisitoInativo(treinamentos, { preRequisitoId: null }), null);
});
