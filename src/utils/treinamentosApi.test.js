import test from 'node:test';
import assert from 'node:assert/strict';
import { meuTreinamentoDaApi, treinamentoDaApi, treinamentoParaApi } from './treinamentosApi.js';

const daApi = {
  id: 7, titulo: 'Uso de EPI', descricao: 'Como usar.', tipo: 'online', videoUrlYoutube: 'https://youtu.be/M7lc1UVf-VE',
  categoria: 'obrigatório', prazoDias: 15, ativo: true, prerequisitos: [{ id: 3 }],
};

test('converte o treinamento da API para o formato da tela', () => {
  assert.deepEqual(treinamentoDaApi(daApi), {
    id: 7, nome: 'Uso de EPI', descricao: 'Como usar.', tipo: 'online', videoUrl: 'https://youtu.be/M7lc1UVf-VE',
    obrigatorio: true, prazoDias: 15, ativo: true, preRequisitoId: 3,
  });
});
test('campos opcionais ausentes viram vazio e categoria diferente de obrigatório vira não obrigatório', () => {
  const convertido = treinamentoDaApi({ ...daApi, descricao: null, videoUrlYoutube: null, categoria: 'não obrigatório', prerequisitos: [] });
  assert.equal(convertido.descricao, '');
  assert.equal(convertido.videoUrl, '');
  assert.equal(convertido.obrigatorio, false);
  assert.equal(convertido.preRequisitoId, null);
  assert.equal(treinamentoDaApi({ ...daApi, categoria: 'segurança', prerequisitos: undefined }).obrigatorio, false);
});
test('converte os valores do formulário para o payload da API', () => {
  const valores = { nome: 'Novo', descricao: 'Texto', tipo: 'online', videoUrl: 'https://youtu.be/M7lc1UVf-VE', obrigatorio: false, prazoDias: 10, preRequisitoId: 2 };
  assert.deepEqual(treinamentoParaApi(valores), {
    titulo: 'Novo', descricao: 'Texto', tipo: 'online', video_url_youtube: 'https://youtu.be/M7lc1UVf-VE',
    categoria: 'não obrigatório', prazo_dias: 10, prerequisito_id: 2,
  });
});
test('vídeo vazio vai como null e pré-requisito removido segue como null', () => {
  const payload = treinamentoParaApi({ nome: 'N', descricao: 'D', tipo: 'presencial', videoUrl: '', obrigatorio: true, prazoDias: 10, preRequisitoId: null });
  assert.equal(payload.video_url_youtube, null);
  assert.equal(payload.prerequisito_id, null);
  assert.equal(payload.categoria, 'obrigatório');
  assert.equal(payload.tipo, 'presencial');
});

const meu = {
  id: 5, titulo: 'Produtos Químicos', descricao: 'Boas práticas.', tipo: 'online', videoUrlYoutube: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
  duracaoVideoSegundos: 840, obrigatorio: true, dataLimite: '2026-11-05', status: 'pendente', dataConclusao: null,
  bloqueado: true, preRequisito: { id: 2, titulo: 'Uso de EPI' }, cas: ['CA-12345', 'CA-67890'],
};

test('converte o treinamento do colaborador, com ids em texto e vídeo extraído do link', () => {
  const t = meuTreinamentoDaApi(meu);
  assert.equal(t.id, '5');
  assert.equal(t.preRequisitoId, '2');
  assert.equal(t.videoId, 'M7lc1UVf-VE');
  assert.equal(t.prazo, '2026-11-05');
  assert.equal(t.ca, 'CA-12345, CA-67890');
  assert.equal(t.duracao, '14 minutos');
  assert.equal(t.etapa, 'Bloqueado');
  assert.equal(t.percentual, 0);
  assert.equal(t.concluidoEm, undefined);
});
test('treinamento do colaborador sem CA, sem prazo, sem vídeo e já concluído', () => {
  const t = meuTreinamentoDaApi({ ...meu, cas: [], dataLimite: null, videoUrlYoutube: null, duracaoVideoSegundos: null, bloqueado: false, preRequisito: null, status: 'concluido', dataConclusao: '2026-10-14T15:00:00+00:00' });
  assert.equal(t.ca, 'Não se aplica');
  assert.equal(t.prazo, null);
  assert.equal(t.videoId, null);
  assert.equal(t.duracao, null);
  assert.equal(t.preRequisitoId, null);
  assert.equal(t.percentual, 100);
  assert.equal(t.etapa, 'Concluído');
  assert.equal(t.concluidoEm, '2026-10-14T15:00:00+00:00');
});
