# Roteiro de Apresentação: Autenticação JWT com bcrypt

**Duração Estimada:** 5 minutos
**Foco:** Registro, login, hash de senha e proteção de rotas

---

## 1. Introdução e Contexto (30s)
**O que falar:**
"Até então nossa API estava aberta — qualquer um podia criar produtos, fornecedores e movimentar estoque. Agora implementamos autenticação com JWT e bcrypt. Somente usuários cadastrados e logados conseguem acessar os endpoints protegidos."

**Ação:** Deixe o servidor rodando em segundo plano (`npm run dev`).

---

## 2. Model User no Banco (30s)
**Ação:** Abrir o arquivo `prisma/schema.prisma` e scrollar até o model `User`.

**O que falar e mostrar:**
- "Adicionamos a entidade `User` ao schema. Campos: `id`, `name`, `email` (único) e `password`. O campo `password` vai armazenar o hash gerado pelo bcrypt — nunca a senha em texto puro."
- *Aponte o `@unique` no email:* "Garantimos que não existam dois usuários com o mesmo e-mail."

---

## 3. Registro de Usuário — `POST /auth/register` (1 min)
**Ação:** Abrir `src/routes/authRoutes.js` e depois `src/controllers/authController.js`.

**O que falar e mostrar:**

- *Nas rotas:* "Temos duas rotas públicas: `/auth/register` e `/auth/login`. Reparem que elas **não** usam middleware de autenticação — senão ninguém conseguiria se cadastrar."

- *No controller, função `register`:*
  - "Validamos nome, e-mail e senha (mínimo 6 caracteres). Se faltar algo, respondemos com **Status 400 (Bad Request)**."
  - "Consultamos o repositório para ver se o e-mail já existe. Se existir, retornamos **Status 409 (Conflict)**."
  - *Destaque do bcrypt:* "Aqui está o coração da segurança: `bcrypt.hash(password, 10)`. O número 10 é o *salt rounds* — quantas vezes o algoritmo embaralha a senha. O resultado é um hash irreversível que vai para o banco. Mesmo que alguém acesse o banco, não consegue recuperar a senha original."
  - "Na resposta, usamos destructuring para **nunca** devolver o password no JSON. Retornamos **Status 201 (Created)**."

**Demonstração no Insomnia — Passo 1:**
- Abra a requisição `POST /auth/register`.
- **Body / JSON:**
```json
{
  "name": "Gustavo Gurgel",
  "email": "gustavo@email.com",
  "password": "123456"
}
```
- *Disparar e mostrar a resposta:* "Vejam o **Status 201 Created** e o body sem o campo password."

---

## 4. Login e Geração do Token — `POST /auth/login` (1 min)
**Ação:** Continuar no `authController.js`, função `login`.

**O que falar e mostrar:**

- "Buscamos o usuário pelo e-mail. Se não encontrar, **Status 401 (Unauthorized)** com mensagem genérica 'Credenciais inválidas' — sem revelar se o e-mail existe ou não."
- "Se encontrou, usamos `bcrypt.compare(password, user.password)`. O bcrypt **não decifra** o hash — ele aplica o mesmo algoritmo na senha enviada e compara os hashes."
- *Destaque do JWT:* "Se a senha bateu, geramos o token com `jwt.sign()`. O payload carrega `id`, `name` e `email` do usuário. Assinamos com uma chave secreta (`JWT_SECRET` do `.env`) e definimos expiração (`expiresIn: '30000'` — 30 segundos para testarmos)."
- "Retornamos **Status 200 (OK)** com o token e os dados do usuário."

**Demonstração no Insomnia — Passo 2:**
- Abra a requisição `POST /auth/login`.
- **Body / JSON:**
```json
{
  "email": "gustavo@email.com",
  "password": "123456"
}
```
- *Disparar e mostrar a resposta:* "Recebemos o token JWT. Copiem ele, vamos usar no próximo passo."
- *Opcional:* "Se eu errar a senha, vejam o **Status 401**."

---

## 5. Middleware de Autenticação — Protegendo as Rotas (1 min 30s)
**Ação:** Abrir `src/middlewares/authenticate.js` e depois qualquer arquivo de rotas (ex: `src/routes/productRoutes.js`).

**O que falar e mostrar:**

- *No middleware:*
  - "Toda requisição autenticada precisa enviar o header `Authorization: Bearer <token>`."
  - "O middleware extrai o token, verificando se o header existe e se está no formato `Bearer ...`. Se não, **Status 401**."
  - "`jwt.verify(token, JWT_SECRET)` valida a assinatura e a expiração. Se o token for inválido ou expirado, **Status 401**. Se for válido, injetamos os dados decodificados em `req.user` e chamamos `next()` para seguir para o controller."

- *Nas rotas protegidas:* Abra `src/routes/productRoutes.js`.
  - "Reparem que **todas** as rotas de produtos, fornecedores, categorias e movimentações têm `authenticate` como middleware. Nenhuma requisição passa sem um token válido."

**Demonstração no Insomnia — Passo 3:**
- Abra a requisição `GET /products`.
- Na aba **Headers**, adicione:
  - `Authorization`: `Bearer <cole-o-token-aqui>`
- *Disparar:* "Com o token válido, a rota funciona normalmente — **Status 200 OK**."
- "Agora vamos remover o header." *(Delete o header e dispare de novo.)* "**Status 401 — Token não fornecido.**"
- "E se o token expirar? Vou esperar 30 segundos e tentar de novo..." *(Aguarde e dispare.)* "**Status 401 — Token inválido ou expirado.**"

---

## 6. Encerramento (30s)
"Esse é o ciclo completo de autenticação da nossa API: registro com senha hasheada via bcrypt, login que devolve um token JWT assinado, e middleware que protege todas as rotas sensíveis. O bcrypt garante que senhas nunca sejam armazenadas em texto puro, e o JWT permite autenticação stateless — o servidor não guarda sessão, cada requisição carrega o token e se prova sozinha. Obrigado!"
