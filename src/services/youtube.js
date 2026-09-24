let carregamento;

export function carregarYouTube() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (carregamento) return carregamento;

  carregamento = new Promise((resolve, reject) => {
    const anterior = window.onYouTubeIframeAPIReady;
    const script = document.createElement('script');
    const tempoLimite = window.setTimeout(falhar, 15000);

    function limpar() {
      window.clearTimeout(tempoLimite);
      script.removeEventListener('error', falhar);
      if (window.onYouTubeIframeAPIReady === pronto) window.onYouTubeIframeAPIReady = anterior;
    }

    function pronto() {
      if (!window.YT?.Player) return;
      limpar();
      resolve(window.YT);
      if (typeof anterior === 'function') anterior();
    }

    function falhar() {
      limpar();
      script.remove();
      reject(new Error('Não foi possível carregar o vídeo. Verifique sua conexão e tente novamente.'));
    }

    window.onYouTubeIframeAPIReady = pronto;
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.addEventListener('error', falhar);
    document.head.appendChild(script);
  }).catch((erro) => {
    carregamento = undefined;
    throw erro;
  });

  return carregamento;
}
