# Plataforma de Treinamentos - Frontend

Frontend da plataforma de treinamentos da Sempher Solutions.

## Stack

- React
- Vite
- JavaScript

## Backend

API REST Laravel mantida em repositório separado.

## Comandos

```bash
npm install
npm run dev
npm run build
```

## Treinamentos do colaborador

O fluxo de demonstração está disponível para usuários autenticados:

- `/colaborador/treinamentos`: lista de treinamentos, prazo, obrigatoriedade, situação e ação de assistir/continuar/rever.
- `/colaborador/treinamentos/:id`: vídeo do YouTube e finalização com declaração e checkbox.

A listagem e o detalhe compartilham estado local. Voltar à lista preserva a
conclusão; recarregar ou sair dessa área restaura os exemplos. Os dados não são
compartilhados com a gestão do admin nem com o dashboard da API. A página de
progresso continua pendente e não faz parte desta entrega.

O vídeo genérico é o exemplo da documentação oficial do YouTube (`M7lc1UVf-VE`),
não o conteúdo real dos treinamentos. A IFrame Player API informa o término por
`YT.PlayerState.ENDED`, que libera o botão de finalizar. Somente chegar ao fim
não conclui o treinamento: é necessário abrir o termo e marcar o checkbox antes
de confirmar. O evento de término não comprova reprodução integral sem avanço.

Cancelamento não registra conclusão. Treinamentos com pré-requisito pendente
ficam bloqueados, inclusive no acesso por URL. Concluir o pré-requisito libera o
dependente. Treinamentos concluídos podem ser revistos sem alterar sua data de
conclusão. Erros ou demora no carregamento do vídeo permitem tentar novamente;
uma falha não libera a finalização.

### Pendências de integração

- Contrato para listar treinamentos atribuídos, obter detalhes/vídeo e registrar conclusão/aceite.
- Fonte e versão do termo definitivo; o texto atual é provisório para demonstração.
- Definição da regra de visualização exigida (término do player ou controle de trechos assistidos).
- Sincronização da conclusão, dos pré-requisitos e dos indicadores com o servidor.

### Teste manual do colaborador

1. Na lista, abra um treinamento disponível e reproduza o vídeo de exemplo.
2. Antes do término, confira que `Finalizar treinamento` está desabilitado.
3. Ao terminar, abra o termo; o botão de confirmação deve começar desabilitado.
4. Marque/desmarque o checkbox e confira a habilitação do botão.
5. Cancele: o treinamento deve continuar em andamento; reabrir deve limpar o aceite.
6. Confirme: volte à lista com situação Concluído, data de conclusão e feedback.
7. Conclua Uso de EPI e verifique a liberação de Trabalho com Produtos Químicos.
8. Confira revisão de concluídos, URL inexistente e acesso direto a um bloqueado.
9. Verifique teclado, tela estreita e erro de rede no carregamento do player.

```bash
node --test src/utils/treinamentos.test.js src/utils/treinamentosColaborador.test.js
npm run build
```

## Variável de ambiente

Configure `VITE_API_URL` para definir a URL base da API Laravel. Consulte `.env.example`.

## Gestão de treinamentos (admin)

A rota autenticada `/admin/treinamentos` está ligada à API Laravel: lista, cria, edita e inativa treinamentos pelos endpoints `GET/POST /treinamentos`, `PATCH /treinamentos/{id}` e `DELETE /treinamentos/{id}` (veja `docs/API.md` no repositório do back-end). Depois de cada alteração a lista é recarregada do servidor. É preciso estar com a API no ar e usar um usuário administrador.

A tela trabalha com `nome`, `obrigatorio`, `prazoDias` e `preRequisitoId`; a API usa `titulo`, `categoria`, `prazo_dias` e `prerequisito_id`. A conversão fica em `src/utils/treinamentosApi.js`. Obrigatório é guardado em `categoria` (`obrigatório` / `não obrigatório`) e o `tipo` enviado na criação é sempre `online` (na edição o tipo não é alterado).

O formulário compartilha os campos nome, obrigatoriedade, prazo em dias e um pré-requisito opcional. O status inicial é ativo; a confirmação de inativação preserva o registro e permite continuar editando suas informações.

Regras de pré-requisito e inativação, validadas no front para dar retorno imediato e **também no back-end**, que é quem decide:

- Prazo é um inteiro positivo. O marco inicial da contagem ainda será definido.
- Um único pré-requisito ativo por treinamento, sem dependência de si mesmo ou ciclos.
- Inativação bloqueada enquanto houver outro treinamento ativo que exija este.
- Não há reativação, exclusão definitiva, upload, aulas ou avaliações nesta entrega.
- Os três indicadores contam somente os registros ativos da lista carregada.

Os componentes `ModalTreinamento` e `ModalInativarTreinamento` aceitam callbacks assíncronos: mantêm o diálogo aberto em caso de erro (exibindo a mensagem devolvida pela API) e bloqueiam envio duplicado.

## Sessão expirada

Se a API responder `401` a uma requisição feita com token (expirado, revogado ou inválido), `src/services/api.js` apaga `token` e `identity` do `localStorage` e redireciona para o login.

### Verificação

```bash
node --test src/utils/*.test.js
npm run build
```
