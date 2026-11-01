Igor Calixto Araujo 22609116
Isaac Leonardo Carneiro Sobral 22607082

# Conversor de Moedas

Aplicação web para conversão de moedas utilizando taxas de câmbio atualizadas por uma API externa, com armazenamento do histórico de conversões em banco de dados.

## Integrantes e divisão das tarefas

| Integrante | Matrícula | Responsabilidades |
|---|---|---|
| [Nome do integrante 1] | [Matrícula] | [Descrever tarefas realizadas] |
| [Nome do integrante 2] | [Matrícula] | [Descrever tarefas realizadas] |

## Tecnologias utilizadas

- **Frontend:** HTML, CSS e JavaScript.
- **Backend:** Node.js e Express.
- **Banco de dados:** Supabase (PostgreSQL).
- **API externa:** [Frankfurter API](https://frankfurter.dev/).
- **Testes:** Jest e Supertest.
- **Integração contínua:** GitHub Actions.
- **Containerização:** Docker.
- **Publicação da imagem:** Docker Hub.

## Funcionalidades

- Conversão entre diferentes moedas.
- Consulta de taxas de câmbio por meio de API externa.
- Listagem de moedas disponíveis.
- Armazenamento das conversões no Supabase.
- Consulta do histórico de conversões.

## Estrutura e funcionamento

O frontend é responsável pela interface e interação com o usuário. As solicitações são encaminhadas ao backend, desenvolvido em Node.js com Express.

O backend consulta as taxas de câmbio na API Frankfurter e utiliza o Supabase para armazenar e recuperar o histórico de conversões.

## Como executar localmente

**1. Clone o repositório:**

```bash
git clone https://github.com/igorCalixtoAraujo/bootcamp2-projeto-final.git
cd bootcamp2-projeto-final
```

**2. Instale as dependências:**

```bash
npm install
```

**3. Configure as variáveis de ambiente.**

Crie um arquivo `.env` na raiz do projeto:

```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_SECRET_KEY=sua_chave_secreta_do_supabase
```

**4. Inicie a aplicação:**

```bash
npm start
```

Acesse: http://localhost:3000

## Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Verifica o funcionamento da API |
| GET | `/api/currencies` | Lista as moedas disponíveis |
| GET | `/api/rate` | Consulta a taxa de câmbio |
| POST | `/api/convert` | Realiza uma conversão |
| GET | `/api/history` | Consulta o histórico de conversões |

## Testes automatizados

Os testes foram implementados utilizando Jest e Supertest.

Para executar:

```bash
npm test
```

Atualmente, o projeto possui **7 testes automatizados**, distribuídos em 2 suítes de testes.

## Integração contínua (CI)

Foi configurado um workflow em `.github/workflows/ci.yml`, utilizando GitHub Actions.

O workflow executa automaticamente os testes durante a abertura ou atualização de Pull Requests direcionadas à branch `main`.

A integração permite verificar se as alterações passam nos testes antes de serem mescladas.

## Docker

O projeto possui um `Dockerfile` para construir a imagem da aplicação e um `.dockerignore` para excluir arquivos desnecessários e informações sensíveis da imagem.

A imagem é publicada automaticamente no Docker Hub por meio do workflow `.github/workflows/docker-publish.yml`, executado após alterações na branch `main`.

**Imagem no Docker Hub:**

```text
[USUARIO_DOCKERHUB]/conversor-moedas:latest
```

### Como executar a imagem

```bash
docker run -d \
  --name conversor-moedas \
  -p 3000:3000 \
  -e SUPABASE_URL="sua_url_do_supabase" \
  -e SUPABASE_SECRET_KEY="sua_chave_secreta_do_supabase" \
  [USUARIO_DOCKERHUB]/conversor-moedas:latest
```

A aplicação ficará disponível em http://localhost:3000.

## Organização do GitHub

O desenvolvimento foi organizado por meio de branches e Pull Requests, evitando alterações diretas na branch `main`.

As funcionalidades foram desenvolvidas em branches separadas e integradas à branch principal após revisão e aprovação.

## Evidência de bloqueio de Pull Request

**[PENDENTE: inserir captura de tela]**

Nesta etapa, deve ser demonstrado que uma Pull Request com testes falhando é impedida de ser mesclada devido às verificações obrigatórias do GitHub Actions.

## Conflitos de mesclagem

[Informar se ocorreram conflitos durante a integração das branches. Caso não tenham ocorrido, registrar que não houve conflitos.]

## Repositório

[GitHub — Projeto Conversor de Moedas](https://github.com/igorCalixtoAraujo/bootcamp2-projeto-final)
