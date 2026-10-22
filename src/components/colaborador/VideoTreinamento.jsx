import { useEffect, useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { carregarYouTube } from '../../services/youtube';
import { avaliarAvanco } from '../../utils/avancoVideo';

// bloquearAvanco impede arrastar o vídeo para além do que já foi assistido (desligado ao rever um treinamento concluído).
function VideoTreinamento({ videoId, onIniciar, onTerminar, bloquearAvanco = true }) {
  const containerRef = useRef(null);
  const callbacksRef = useRef({ onIniciar, onTerminar });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const [aviso, setAviso] = useState('');
  const bloquearRef = useRef(bloquearAvanco);
  const avisoTimerRef = useRef();

  useEffect(() => { callbacksRef.current = { onIniciar, onTerminar }; }, [onIniciar, onTerminar]);
  useEffect(() => { bloquearRef.current = bloquearAvanco; }, [bloquearAvanco]);
  useEffect(() => () => window.clearTimeout(avisoTimerRef.current), []);

  useEffect(() => {
    let cancelado = false;
    let player;
    let tempoLimite;
    let falhou = false;
    let vigia;
    let limite = 0; // maior ponto (em segundos) já assistido
    let ultimaVerificacao = 0;
    const agora = () => performance.now() / 1000;
    const container = containerRef.current;
    const alvo = document.createElement('div');
    container.appendChild(alvo);
    setCarregando(true);
    setErro('');

    function falhar(mensagem) {
      if (cancelado) return;
      falhou = true;
      window.clearTimeout(tempoLimite);
      setCarregando(false);
      setErro(mensagem);
    }

    function avisarSalto() {
      setAviso('Você só pode avançar até onde já assistiu. O vídeo voltou ao ponto em que você parou.');
      window.clearTimeout(avisoTimerRef.current);
      avisoTimerRef.current = window.setTimeout(() => setAviso(''), 5000);
    }

    // Devolve true se o tempo é válido; se houve salto para a frente, volta o vídeo ao limite e devolve false.
    function conferirAvanco(tempoAtual, decorrido) {
      const resultado = avaliarAvanco({ limite, tempoAtual, decorrido, velocidade: player.getPlaybackRate?.() ?? 1 });
      limite = resultado.limite;
      if (resultado.voltarPara === null) return true;
      player.seekTo(resultado.voltarPara, true);
      avisarSalto();
      return false;
    }

    function pararVigia() {
      window.clearInterval(vigia);
      vigia = undefined;
    }

    function iniciarVigia() {
      pararVigia();
      ultimaVerificacao = agora();
      vigia = window.setInterval(() => {
        const agoraSegundos = agora();
        const decorrido = agoraSegundos - ultimaVerificacao;
        ultimaVerificacao = agoraSegundos;
        conferirAvanco(player.getCurrentTime(), decorrido);
      }, 500);
    }

    async function montar() {
      if (!/^[\w-]{11}$/.test(videoId || '')) {
        falhar('Este treinamento ainda não possui um vídeo válido.');
        return;
      }
      try {
        const youtube = await carregarYouTube();
        if (cancelado) return;
        tempoLimite = window.setTimeout(() => falhar('O vídeo demorou para responder. Tente carregá-lo novamente.'), 15000);
        player = new youtube.Player(alvo, {
          width: '100%',
          height: '100%',
          videoId,
          playerVars: { origin: window.location.origin, playsinline: 1, rel: 0 },
          events: {
            onReady(event) {
              if (cancelado || falhou) return;
              window.clearTimeout(tempoLimite);
              event.target.getIframe().setAttribute('title', 'Vídeo do treinamento');
              setCarregando(false);
            },
            onStateChange(event) {
              if (cancelado || falhou) return;
              const decorrido = vigia ? agora() - ultimaVerificacao : 0;
              if (event.data === youtube.PlayerState.PLAYING) {
                callbacksRef.current.onIniciar();
                if (bloquearRef.current) {
                  conferirAvanco(player.getCurrentTime(), 0);
                  iniciarVigia();
                }
                return;
              }
              pararVigia();
              if (event.data === youtube.PlayerState.ENDED) {
                // Arrastar até o fim também dispara "terminou": só vale se o vídeo foi assistido até lá.
                if (bloquearRef.current && !conferirAvanco(player.getDuration(), decorrido)) {
                  player.playVideo();
                  return;
                }
                callbacksRef.current.onTerminar();
              }
            },
            onError() {
              falhar('Não foi possível reproduzir este vídeo. Ele pode estar indisponível ou não permitir reprodução nesta página.');
            },
          },
        });
      } catch (error) {
        falhar(error.message || 'Não foi possível carregar o vídeo.');
      }
    }

    montar();
    return () => {
      cancelado = true;
      pararVigia();
      window.clearTimeout(tempoLimite);
      player?.destroy();
      container.replaceChildren();
    };
  }, [videoId, tentativa]);

  return (
    <Box>
      <Box sx={{ position: 'relative', minHeight: 200, aspectRatio: '16 / 9', bgcolor: '#112f21', borderRadius: '12px', overflow: 'hidden', display: erro ? 'none' : 'block' }}>
        <Box ref={containerRef} sx={{ width: '100%', height: '100%', '& iframe': { width: '100%', height: '100%', border: 0 } }} />
        {carregando && <Box role="status" sx={{ position: 'absolute', inset: 0, display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center', bgcolor: '#112f21' }}><CircularProgress size={24} sx={{ color: '#c9eedd' }} /><Typography sx={{ color: 'white', fontSize: 14 }}>Carregando vídeo...</Typography></Box>}
      </Box>
      {aviso && <Alert severity="info" role="status" sx={{ mt: 1.5 }}>{aviso}</Alert>}
      {erro && <Alert severity="error" action={<Button color="inherit" onClick={() => setTentativa((valor) => valor + 1)}>Tentar novamente</Button>} sx={{ '& .MuiAlert-action': { alignItems: 'center' } }}>{erro}</Alert>}
    </Box>
  );
}

export default VideoTreinamento;
