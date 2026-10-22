// Marca ou desmarca um grupo, devolvendo uma lista nova (sem alterar a original).
export function alternarGrupo(selecionados, grupoId) {
  return selecionados.includes(grupoId) ? selecionados.filter((id) => id !== grupoId) : [...selecionados, grupoId];
}

// Compara os grupos que o treinamento já tinha com os que ficaram marcados e devolve só a diferença,
// que é o que o PATCH /treinamentos/{id} espera: grupos_adicionados e grupos_removidos.
export function calcularMudancaGrupos(atuais, selecionados) {
  return {
    adicionados: selecionados.filter((id) => !atuais.includes(id)),
    removidos: atuais.filter((id) => !selecionados.includes(id)),
  };
}
