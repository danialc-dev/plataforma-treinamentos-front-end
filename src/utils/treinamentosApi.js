// Tradução entre o formato da tela (nome, obrigatorio, preRequisitoId) e o da API Laravel
// (titulo, categoria, prerequisitos). Fica isolada aqui para a tela não conhecer o contrato.
const CATEGORIA_OBRIGATORIO = 'obrigatório';
const CATEGORIA_NAO_OBRIGATORIO = 'não obrigatório';
const TIPO_PADRAO = 'online';

export function treinamentoDaApi(dados) {
  return {
    id: dados.id,
    nome: dados.titulo,
    obrigatorio: String(dados.categoria ?? '').trim().toLowerCase() === CATEGORIA_OBRIGATORIO,
    prazoDias: dados.prazoDias,
    ativo: dados.ativo,
    preRequisitoId: dados.prerequisitos?.[0]?.id ?? null,
  };
}

// O tipo só é enviado na criação: o formulário não o edita e um PATCH com "online"
// sobrescreveria treinamentos presenciais já cadastrados.
export function treinamentoParaApi(valores, { criando }) {
  return {
    titulo: valores.nome,
    categoria: valores.obrigatorio ? CATEGORIA_OBRIGATORIO : CATEGORIA_NAO_OBRIGATORIO,
    prazo_dias: valores.prazoDias,
    prerequisito_id: valores.preRequisitoId ?? null,
    ...(criando ? { tipo: TIPO_PADRAO } : {}),
  };
}
