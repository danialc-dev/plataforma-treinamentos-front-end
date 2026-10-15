const ID_YOUTUBE = /^[\w-]{11}$/;

// Aceita os formatos comuns de link do YouTube e devolve o ID de 11 caracteres, ou null.
export function extrairVideoId(valor) {
  let url;
  try {
    url = new URL(String(valor ?? '').trim());
  } catch {
    return null;
  }
  if (!['http:', 'https:'].includes(url.protocol)) return null;

  const host = url.hostname.replace(/^(www|m)\./, '');
  let id = null;
  if (host === 'youtu.be') {
    id = url.pathname.slice(1).split('/')[0];
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    id = url.pathname === '/watch' ? url.searchParams.get('v') : url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?]+)/)?.[1];
  }

  return ID_YOUTUBE.test(id ?? '') ? id : null;
}
