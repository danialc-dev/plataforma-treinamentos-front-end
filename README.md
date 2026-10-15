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

Disponível para usuários autenticados (inclusive administradores, que também são colaboradores). Os dados vêm da API Laravel (`GET /meus-treinamentos`, `POST /meus-treinamentos/{id}/iniciar` e `/concluir`; veja `docs/API.md` no repositório do back-end):

- `/colaborador/treinamentos`: lista de treinamentos, prazo, obrigatoriedade, situação e ação de assistir/continuar/rever.
- `/colaborador/treinamentos/:id`: vídeo do YouTube e finalização com declaração e checkbox.
- `/colaborador/progresso`: indicadores e conquistas calculados a partir da mesma lista.

A lista é carregada uma vez pela área (`src/components/colaborador/AreaTreinamentos.jsx`) e compartilhada entre as telas, que mostram "carregando" ou o erro com "Tentar novamente" (`AguardarTreinamentos`). Depois de concluir, a lista é recarregada em segundo plano para refletir a conclusão e liberar os treinamentos que dependiam dele.

**O vídeo** é o `videoUrlYoutube` cadastrado pelo administrador no treinamento. O ID de 11 caracteres é extraído do link por `src/utils/youtube.js` e o player é criado em `VideoTreinamento.jsx`. Um treinamento sem link válido mostra "Este treinamento ainda não possui um vídeo válido." A IFrame Player API informa o término por `YT.PlayerState.ENDED`, que libera o botão de finalizar. Chegar ao fim **não** conclui: é preciso abrir o termo e marcar o checkbox antes de confirmar. O evento de término não comprova reprodução integral sem avanço, e **só o front verifica o fim do vídeo**: o servidor exige apenas o aceite dos termos.

Treinamentos com pré-requisito pendente ficam bloqueados, inclusive no acesso por URL (o back-end também recusa iniciar ou concluir). Concluir o pré-requisito libera o dependente. Treinamentos concluídos podem ser revistos sem alterar sua data de conclusão. Treinamentos **presenciais** não têm vídeo: a tela avisa que a conclusão é registrada pelo administrador. Erros ou demora no carregamento do vídeo permitem tentar novamente; uma falha não libera a finalização.

### Limitações atuais

- **Quem recebe cada treinamento é provisório:** hoje todo treinamento ativo da empresa é atribuído a todos os colaboradores (regra no back, `AtribuicaoService::sincronizar`). A regra por CA/GHE do STW substituirá isso.
- O progresso por treinamento não é medido: é 100% quando concluído e 0% nos demais.
- O texto do termo é provisório (`ModalConclusaoTreinamento.jsx`); o definitivo virá da Sempher.
- Definição da regra de visualização exigida (término do player ou controle de trechos assistidos).
- A home do colaborador usa o dashboard da API e, se ele falhar, dados locais de `src/data/colaborador.js`.

### Teste manual do colaborador

1. Entre como colaborador (ex.: `222.222.222-22`, senha `password`) com a API no ar e os dados de demonstração (`php artisan migrate:fresh --seed`).
2. Na lista, abra um treinamento disponível e reproduza o vídeo.
3. Antes do término, confira que `Finalizar treinamento` está desabilitado.
4. Ao terminar, abra o termo; o botão de confirmação deve começar desabilitado.
5. Marque/desmarque o checkbox e confira a habilitação do botão.
6. Cancele: o treinamento deve continuar em andamento; reabrir deve limpar o aceite.
7. Confirme: volte à lista com situação Concluído e a data de conclusão. **Recarregue a página: a conclusão continua**, porque está no banco.
8. Conclua "Integração de Segurança" e verifique a liberação de "Trabalho com Produtos Químicos".
9. Confira revisão de concluídos, URL inexistente, acesso direto a um bloqueado e um treinamento presencial.
10. Verifique teclado, tela estreita e erro de rede no carregamento do player.

```bash
node --test src/utils/*.test.js
npm run build
```

## Variável de ambiente

Configure `VITE_API_URL` para definir a URL base da API Laravel. Consulte `.env.example`.

## Gestão de treinamentos (admin)

A rota autenticada `/admin/treinamentos` está ligada à API Laravel: lista, cria, edita, inativa e ativa treinamentos pelos endpoints `GET/POST /treinamentos` e `PATCH/DELETE /treinamentos/{id}` (veja `docs/API.md` no repositório do back-end). Depois de cada alteração a lista é recarregada do servidor. É preciso estar com a API no ar e usar um usuário administrador.

**Campos do formulário** (`ModalTreinamento.jsx`), na ordem: título, descrição, tipo, link do vídeo (YouTube), categoria, prazo em dias e pré-requisito opcional.

- **Tipo:** só *Online* pode ser escolhido. *Presencial — em breve* aparece desabilitado, porque terá regras próprias (endereço, presença). Treinamentos presenciais já existentes continuam sendo exibidos.
- **Descrição:** opcional.
- **Link do vídeo:** obrigatório para treinamentos online (o back-end também exige). Aceita links `youtube.com/watch`, `youtu.be`, `embed` e `shorts`.
- **Categoria:** *Obrigatório* ou *Não obrigatório* (guardada em `categoria`).
- **Prazo:** o texto de ajuda explica que é o tempo máximo, em dias, que a pessoa tem para concluir.
- Não aparecem no formulário: presença mínima, duração do vídeo, ativo (o treinamento nasce ativo), empresa e criado por (vêm do servidor).

A tela trabalha com `nome`, `descricao`, `tipo`, `videoUrl`, `obrigatorio`, `prazoDias` e `preRequisitoId`; a API usa `titulo`, `descricao`, `tipo`, `video_url_youtube`, `categoria`, `prazo_dias` e `prerequisito_id`. A conversão fica em `src/utils/treinamentosApi.js`.

**Ativar e inativar:** o botão de liga/desliga em cada linha inativa um treinamento ativo (com confirmação) e ativa de novo um inativo. O registro nunca é apagado.

Regras validadas no front para dar retorno imediato e **também no back-end**, que é quem decide:

- Prazo é um inteiro positivo. O marco inicial da contagem ainda será definido.
- Um único pré-requisito ativo por treinamento, sem dependência de si mesmo ou ciclos.
- Inativação bloqueada enquanto houver outro treinamento ativo que exija este.
- Ativação bloqueada enquanto o pré-requisito do treinamento estiver inativo.
- Não há exclusão definitiva, upload, aulas ou avaliações nesta entrega.
- Os três indicadores contam somente os registros ativos da lista carregada.

Os componentes `ModalTreinamento` e `ModalInativarTreinamento` aceitam callbacks assíncronos: mantêm o diálogo aberto em caso de erro (exibindo a mensagem devolvida pela API) e bloqueiam envio duplicado.

## Sessão expirada

Se a API responder `401` a uma requisição feita com token (expirado, revogado ou inválido), `src/services/api.js` apaga `token` e `identity` do `localStorage` e redireciona para o login.

### Verificação

```bash
node --test src/utils/*.test.js
npm run build
```
