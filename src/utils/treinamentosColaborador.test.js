import test from 'node:test';
import assert from 'node:assert/strict';
import { atualizarTreinamentos, erroConclusao, estaBloqueado, formatarDataTreinamento, prazoVencido, situacaoTreinamento } from './treinamentosColaborador.js';

// Dados de apoio dos testes (antes ficavam em src/data; agora a lista vem da API).
function criarTreinamentosColaborador(hoje = new Date()) {
  function data(dias) {
    const valor = new Date(hoje);
    valor.setDate(valor.getDate() + dias);
    return `${valor.getFullYear()}-${String(valor.getMonth() + 1).padStart(2, '0')}-${String(valor.getDate()).padStart(2, '0')}`;
  }
  const base = { videoId: 'M7lc1UVf-VE', preRequisitoId: null, obrigatorio: true, percentual: 0 };
  return [
    { ...base, id: '1', titulo: 'NR-35 - Trabalho em Altura', prazo: data(3), status: 'em_andamento', percentual: 65 },
    { ...base, id: '2', titulo: 'Uso de EPI', prazo: data(-2), status: 'pendente' },
    { ...base, id: '3', titulo: 'Integração de Novos Colaboradores', prazo: data(7), status: 'concluido', percentual: 100, concluidoEm: `${data(-1)}T12:00:00` },
    { ...base, id: '4', titulo: 'Ergonomia no ambiente de trabalho', prazo: data(15), status: 'pendente', obrigatorio: false },
    { ...base, id: '5', titulo: 'Trabalho com Produtos Químicos', prazo: data(30), status: 'pendente', preRequisitoId: '2' },
  ];
}

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

test('lista nova do servidor substitui a anterior e preserva só o vídeo já assistido', () => {
  const assistidos = atualizarTreinamentos(exemplos(), { tipo: 'videoFinalizado', id: '2' });
  const doServidor = exemplos().map((item) => (item.id === '4' ? { ...item, status: 'em_andamento' } : item));
  const atualizados = atualizarTreinamentos(assistidos, { tipo: 'carregar', treinamentos: doServidor });
  assert.equal(atualizados.length, 5);
  assert.equal(atualizados[1].videoFinalizado, true);
  assert.equal(atualizados[3].status, 'em_andamento');
  assert.equal(atualizados[3].videoFinalizado, undefined);
  const concluidos = atualizarTreinamentos(assistidos, { tipo: 'carregar', treinamentos: exemplos().map((item) => (item.id === '2' ? { ...item, status: 'concluido' } : item)) });
  assert.equal(concluidos[1].videoFinalizado, undefined);
});

test('sem prazo o treinamento nunca aparece vencido e a data mostra "Sem prazo"', () => {
  assert.equal(prazoVencido({ prazo: null, status: 'pendente' }, new Date(2030, 0, 1)), false);
  assert.equal(formatarDataTreinamento(null), 'Sem prazo');
  assert.equal(formatarDataTreinamento('2026-09-24'), new Date('2026-09-24T12:00:00').toLocaleDateString('pt-BR'));
});
