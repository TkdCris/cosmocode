# 🚀 CosmoCode - CosmoPay Integration

Este é o projeto base do CosmoCode, apresentando a integração premium do **CosmoPay** com Mercado Pago e Prisma 7.

## 🛠️ Guia de Desenvolvimento e Testes

Para rodar o projeto localmente com todas as funcionalidades do CosmoPay (incluindo Webhooks e Pix), siga os passos abaixo.

### 1. Configuração do Ambiente (`.env.local`)
Certifique-se de que seu arquivo `.env.local` contenha as credenciais de teste do Mercado Pago e a URL do banco de dados da Contabo:
```bash
DATABASE_URL="postgresql://user:pass@host:port/db?schema=public"
MP_ACCESS_TOKEN_COSMOCODE="TEST-..."
NEXT_PUBLIC_MP_PUBLIC_KEY_COSMOCODE="TEST-..."
NEXT_PUBLIC_API_BASE_URL="SUA_URL_NGROK (ou cloudflare)"
```

### 2. Sincronização do Banco (Prisma 7)
O projeto usa Prisma 7. Existem dois comandos principais para manter o banco e o código em sincronia:

#### A. Do Código para o Banco (Push)
Use quando você alterar o arquivo `schema.prisma` e quiser enviar as mudanças para o banco de dados:
```bash
npx prisma db push
npx prisma generate
```

#### B. Do Banco para o Código (Pull)
Use quando você fizer alterações diretamente no banco de dados (ex: via **pgAdmin**) e quiser que o arquivo `schema.prisma` seja atualizado automaticamente:
```bash
npx prisma db pull
npx prisma generate
```
*Sempre rode o `generate` após um pull ou push para atualizar o Prisma Client.*

### 3. Exposição para Webhooks (Túneis)
Como o Mercado Pago precisa enviar notificações (Webhooks) para o seu computador, você deve usar um túnel.

#### Opção A: Ngrok (Recomendado)
Execute em um terminal separado:
```bash
ngrok http 3000
```
Copie a URL gerada (ex: `https://abcd-123.ngrok-free.app`) e cole na variável `NEXT_PUBLIC_API_BASE_URL` do `.env.local`.

#### Opção B: Cloudflare Tunnel
Execute:
```bash
cloudflared tunnel --url http://localhost:3000
```

### 4. Rodando o Projeto
Com o túnel ativo e o `.env` configurado:
```bash
npm run dev
```

---

## 🧪 Ferramentas de Teste (CosmoPay DevTools)

O sistema possui facilitadores exclusivos para o ambiente de desenvolvimento:

### Simulação de Pagamento
Ao testar o checkout com **PIX**, você verá um botão na página de sucesso chamado **"Simular Aprovação de Pagamento"**.
- Este botão chama a API `/api/cosmopay/simulate`.
- Ele força o status `approved` no banco de dados local para você testar o fluxo pós-venda sem precisar de um pagamento real.
- **Nota:** Este botão desaparece automaticamente em produção (`NODE_ENV=production`).

### Banco de Dados (pgAdmin)
Para gerenciar e consultar as transações de forma visual:
1.  **Painel Web Seguro:** [https://cosmopay.carctrl.duckdns.org/browser/](https://cosmopay.carctrl.duckdns.org/browser/)
2.  **Credenciais:** Consulte o arquivo local `CREDENTIALS.md`.

3.  **Instruções de Acesso:** Verifique o `CREDENTIALS.md` para obter o login do pgAdmin, Host do Banco e as chaves de manutenção.

4.  **Query de Consulta Rápida:**
    ```sql
    SELECT * FROM "Transaction" ORDER BY "createdAt" DESC;
    ```

---

## 📡 Endpoints de API

- `POST /api/cosmopay/checkout`: Cria a preferência no Mercado Pago.
- `POST /api/cosmopay/process`: Processa o pagamento transparente.
- `POST /api/cosmopay/webhook`: Recebe notificações reais de pagamento.
- `POST /api/cosmopay/simulate`: Rota de teste para forçar aprovação.

---
© 2026 Cosmo Code - Cristiano L Duarte
