import test from 'node:test';
import assert from 'node:assert/strict';
import { avaliarAvanco } from './avancoVideo.js';

test('reprodução normal avança o limite e não volta o vídeo', () => {
  let estado = { limite: 0, voltarPara: null };
  for (let t = 0.5; t <= 10; t += 0.5) {
    estado = avaliarAvanco({ limite: estado.limite, tempoAtual: t, decorrido: 0.5, velocidade: 1 });
    assert.equal(estado.voltarPara, null);
  }
  assert.equal(estado.limite, 10);
});

test('arrastar a barra para frente volta ao ponto máximo já assistido', () => {
  assert.deepEqual(avaliarAvanco({ limite: 30, tempoAtual: 600, decorrido: 0.5 }), { limite: 30, voltarPara: 30 });
});

test('arrastar para o final do vídeo também é bloqueado', () => {
  assert.deepEqual(avaliarAvanco({ limite: 12, tempoAtual: 3000, decorrido: 0 }), { limite: 12, voltarPara: 12 });
});

test('voltar para trás é livre e não diminui o limite', () => {
  assert.deepEqual(avaliarAvanco({ limite: 100, tempoAtual: 20, decorrido: 0.5 }), { limite: 100, voltarPara: null });
});

test('depois de voltar, rever trechos já assistidos não bloqueia', () => {
  let estado = avaliarAvanco({ limite: 100, tempoAtual: 20, decorrido: 0.5 });
  estado = avaliarAvanco({ limite: estado.limite, tempoAtual: 20.5, decorrido: 0.5 });
  assert.equal(estado.voltarPara, null);
  assert.equal(estado.limite, 100);
});

test('velocidade 2x não é confundida com arrasto', () => {
  assert.equal(avaliarAvanco({ limite: 10, tempoAtual: 11, decorrido: 0.5, velocidade: 2 }).voltarPara, null);
  assert.equal(avaliarAvanco({ limite: 10, tempoAtual: 12.4, decorrido: 0.5, velocidade: 2 }).voltarPara, null);
});

test('verificação atrasada (aba em segundo plano) permite o avanço natural proporcional', () => {
  assert.equal(avaliarAvanco({ limite: 100, tempoAtual: 160, decorrido: 60, velocidade: 1 }).voltarPara, null);
  assert.equal(avaliarAvanco({ limite: 100, tempoAtual: 400, decorrido: 60, velocidade: 1 }).voltarPara, 100);
});

test('ao iniciar ou retomar (decorrido 0), um tempo muito à frente do limite é bloqueado', () => {
  assert.equal(avaliarAvanco({ limite: 0, tempoAtual: 900, decorrido: 0 }).voltarPara, 0);
  assert.equal(avaliarAvanco({ limite: 0, tempoAtual: 0.4, decorrido: 0 }).voltarPara, null);
});

test('fim natural do vídeo é aceito e salto para o fim não é', () => {
  assert.equal(avaliarAvanco({ limite: 2999.4, tempoAtual: 3000, decorrido: 0.5 }).voltarPara, null);
  assert.equal(avaliarAvanco({ limite: 1500, tempoAtual: 3000, decorrido: 0.5 }).voltarPara, 1500);
});
