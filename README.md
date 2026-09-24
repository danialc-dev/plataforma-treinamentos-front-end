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

## Modais de gestão de treinamentos

A rota autenticada `/admin/treinamentos` permite criar, editar e inativar treinamentos usando dados de exemplo. As alterações existem somente enquanto a página está montada: sair dela ou recarregar restaura os quatro exemplos originais. Nenhuma operação desses modais chama a API ou altera o dashboard do servidor.

O formulário compartilha os campos nome, obrigatoriedade, prazo em dias e um pré-requisito opcional. O status inicial é ativo; a confirmação de inativação preserva o registro e permite continuar editando suas informações.

Regras provisórias para validar com o time/backend:

- Prazo é um inteiro positivo. O marco inicial da contagem ainda será definido.
- Um único pré-requisito ativo por treinamento, sem dependência de si mesmo ou ciclos.
- Inativação bloqueada enquanto houver outro treinamento ativo que exija este.
- Não há reativação, exclusão definitiva, upload, aulas ou avaliações nesta entrega.
- Os três indicadores contam somente os registros ativos da lista local.

Os componentes `ModalTreinamento` e `ModalInativarTreinamento` aceitam callbacks assíncronos: mantêm o diálogo aberto em caso de erro e bloqueiam envio duplicado. Para integrar, substituir a fonte local e os callbacks da página pelas operações reais, respeitando os endpoints, identificadores e payloads definidos pelo backend.

### Verificação

```bash
node --test src/utils/treinamentos.test.js
npm run build
```
