import test from 'node:test';
import assert from 'node:assert/strict';
import { extrairVideoId } from './youtube.js';

test('extrai o ID dos formatos comuns de link do YouTube', () => {
  for (const link of [
    'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    'https://youtube.com/watch?v=M7lc1UVf-VE&t=30s',
    'https://m.youtube.com/watch?v=M7lc1UVf-VE',
    'https://youtu.be/M7lc1UVf-VE',
    'https://youtu.be/M7lc1UVf-VE?si=abc',
    'https://www.youtube.com/embed/M7lc1UVf-VE',
    'https://www.youtube.com/shorts/M7lc1UVf-VE',
    '  https://www.youtube.com/watch?v=M7lc1UVf-VE  ',
  ]) assert.equal(extrairVideoId(link), 'M7lc1UVf-VE', link);
});

test('rejeita links que não são vídeos do YouTube', () => {
  for (const link of [
    '',
    undefined,
    null,
    'M7lc1UVf-VE',
    'www.youtube.com/watch?v=M7lc1UVf-VE',
    'https://www.youtube.com/watch?v=curto',
    'https://www.youtube.com/watch',
    'https://www.youtube.com/playlist?list=PL123',
    'https://vimeo.com/M7lc1UVf-VE',
    'https://exemplo.com/watch?v=M7lc1UVf-VE',
    'ftp://youtube.com/watch?v=M7lc1UVf-VE',
  ]) assert.equal(extrairVideoId(link), null, String(link));
});
