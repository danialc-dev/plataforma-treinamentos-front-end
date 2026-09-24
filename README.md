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
