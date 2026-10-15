// Tradução entre o formato da tela e o da API Laravel. Fica isolada aqui para as telas
// não precisarem conhecer o contrato (nomes de campos, categoria como texto, etc.).
import { extrairVideoId } from './youtube.js';

const CATEGORIA_OBRIGATORIO = 'obrigatório';
const CATEGORIA_NAO_OBRIGATORIO = 'não obrigatório';

const ehObrigatorio = (categoria) => String(categoria ?? '').trim().toLowerCase() === CATEGORIA_OBRIGATORIO;

// ---- Gestão de treinamentos (admin) ----------------------------------------

export function treinamentoDaApi(dados) {
  return {
    id: dados.id,
    nome: dados.titulo,
    descricao: dados.descricao ?? '',
    tipo: dados.tipo,
    videoUrl: dados.videoUrlYoutube ?? '',
    obrigatorio: ehObrigatorio(dados.categoria),
    prazoDias: dados.prazoDias,
    ativo: dados.ativo,
    preRequisitoId: dados.prerequisitos?.[0]?.id ?? null,
  };
}

export function treinamentoParaApi(valores) {
  return {
    titulo: valores.nome,
    descricao: valores.descricao,
    tipo: valores.tipo,
    video_url_youtube: valores.videoUrl || null,
    categoria: valores.obrigatorio ? CATEGORIA_OBRIGATORIO : CATEGORIA_NAO_OBRIGATORIO,
    prazo_dias: valores.prazoDias,
    prerequisito_id: valores.preRequisitoId ?? null,
  };
}

// ---- Área do colaborador ---------------------------------------------------

function duracaoEmTexto(segundos) {
  if (!segundos) return null;
  const minutos = Math.max(1, Math.round(segundos / 60));
  return `${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
}

function etapa(dados) {
  if (dados.status === 'concluido') return 'Concluído';
  if (dados.bloqueado) return 'Bloqueado';
  return dados.status === 'em_andamento' ? 'Em andamento' : 'Ainda não iniciado';
}

// Os ids viram texto porque vêm da URL (useParams) e são comparados com ===.
// O progresso por treinamento não é medido: é 100% quando concluído e 0% nos demais.
export function meuTreinamentoDaApi(dados) {
  return {
    id: String(dados.id),
    titulo: dados.titulo,
    descricao: dados.descricao || 'Sem descrição cadastrada.',
    tipo: dados.tipo,
    ca: dados.cas?.length ? dados.cas.join(', ') : 'Não se aplica',
    duracao: duracaoEmTexto(dados.duracaoVideoSegundos),
    obrigatorio: dados.obrigatorio,
    prazo: dados.dataLimite,
    status: dados.status,
    percentual: dados.status === 'concluido' ? 100 : 0,
    etapa: etapa(dados),
    concluidoEm: dados.dataConclusao ?? undefined,
    videoId: extrairVideoId(dados.videoUrlYoutube),
    preRequisitoId: dados.preRequisito ? String(dados.preRequisito.id) : null,
  };
}
