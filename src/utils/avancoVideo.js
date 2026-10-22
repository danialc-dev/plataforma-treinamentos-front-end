// Regra que impede de "pular" o vídeo. O front vigia o tempo atual do player; se ele avançar além do
// que foi realmente assistido, o vídeo volta ao ponto máximo já visto. Voltar para trás é sempre livre.
//
// "limite" é o maior ponto (em segundos) já assistido. Entre duas verificações o vídeo pode avançar
// naturalmente: decorrido (tempo real passado) × velocidade de reprodução. A "folga" cobre atrasos
// pequenos de verificação. Qualquer salto maior que isso é considerado arrasto da barra.
export const FOLGA_SEGUNDOS = 1.5;

export function avaliarAvanco({ limite, tempoAtual, decorrido = 0, velocidade = 1, folga = FOLGA_SEGUNDOS }) {
  const avancoNatural = Math.max(0, decorrido) * Math.max(1, velocidade);
  const permitido = limite + avancoNatural + folga;

  if (tempoAtual > permitido) return { limite, voltarPara: limite };
  return { limite: Math.max(limite, tempoAtual), voltarPara: null };
}
