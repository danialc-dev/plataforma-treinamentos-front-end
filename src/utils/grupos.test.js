import test from 'node:test';
import assert from 'node:assert/strict';
import { alternarGrupo, calcularMudancaGrupos } from './grupos.js';

test('marca e desmarca um grupo sem alterar a lista original', () => {
  const original = [1, 2];
  assert.deepEqual(alternarGrupo(original, 3), [1, 2, 3]);
  assert.deepEqual(alternarGrupo(original, 2), [1]);
  assert.deepEqual(original, [1, 2]);
});

test('sem alteração nos grupos, nada é adicionado nem removido', () => {
  assert.deepEqual(calcularMudancaGrupos([1, 2], [2, 1]), { adicionados: [], removidos: [] });
  assert.deepEqual(calcularMudancaGrupos([], []), { adicionados: [], removidos: [] });
});

test('calcula somente os grupos novos e os que foram desmarcados', () => {
  assert.deepEqual(calcularMudancaGrupos([1, 2], [2, 3, 4]), { adicionados: [3, 4], removidos: [1] });
  assert.deepEqual(calcularMudancaGrupos([], [5]), { adicionados: [5], removidos: [] });
  assert.deepEqual(calcularMudancaGrupos([5, 6], []), { adicionados: [], removidos: [5, 6] });
});
