import test from 'node:test';
import assert from 'node:assert/strict';
import { treinamentoDaApi, treinamentoParaApi } from './treinamentosApi.js';

const daApi = { id: 7, titulo: 'Uso de EPI', categoria: 'obrigatório', prazoDias: 15, ativo: true, prerequisitos: [{ id: 3 }] };

test('converte o treinamento da API para o formato da tela', () => {
  assert.deepEqual(treinamentoDaApi(daApi), { id: 7, nome: 'Uso de EPI', obrigatorio: true, prazoDias: 15, ativo: true, preRequisitoId: 3 });
});
test('categoria diferente de obrigatório vira não obrigatório e ausência de pré-requisito vira null', () => {
  const convertido = treinamentoDaApi({ ...daApi, categoria: 'não obrigatório', prerequisitos: [] });
  assert.equal(convertido.obrigatorio, false);
  assert.equal(convertido.preRequisitoId, null);
  assert.equal(treinamentoDaApi({ ...daApi, categoria: 'segurança', prerequisitos: undefined }).obrigatorio, false);
});
test('converte os valores do formulário para o payload da API', () => {
  const valores = { nome: 'Novo', obrigatorio: false, prazoDias: 10, preRequisitoId: 2 };
  assert.deepEqual(treinamentoParaApi(valores, { criando: true }), { titulo: 'Novo', categoria: 'não obrigatório', prazo_dias: 10, prerequisito_id: 2, tipo: 'online' });
});
test('na edição o tipo não é enviado e pré-requisito removido segue como null', () => {
  const payload = treinamentoParaApi({ nome: 'Novo', obrigatorio: true, prazoDias: 10, preRequisitoId: null }, { criando: false });
  assert.equal('tipo' in payload, false);
  assert.equal(payload.prerequisito_id, null);
  assert.equal(payload.categoria, 'obrigatório');
});
