# BoxMonitor Instagram

Artes, legendas e publicação automática do Instagram do BoxMonitor.

- `gerador/conteudo.mjs`: textos de todos os posts (artes, legendas, roteiros dos Reels).
- `gerador/gerar.mjs`: gera `posts/` (PNG + JPEG), `agenda.json` e `CRONOGRAMA.txt`.
- `publicar.mjs`: publica o próximo post vencido da `agenda.json` (1 por execução) e registra em `publicados.json`.
- `.github/workflows/publicar.yml`: roda o `publicar.mjs` todo dia às 12:07 (Brasília).

Os Reels **não** são publicados automaticamente: só a capa e o roteiro ficam em `posts/`.

## Mudar textos ou datas

```bash
npm install
# edite gerador/conteudo.mjs (a data do post vem do nome da pasta: NN-AAAA-MM-DD-...)
npm run gerar
git add -A && git commit -m "update instagram posts" && git push
```

O horário de publicação é `PUBLISH_TIME` em `gerador/gerar.mjs`. Para publicar de novo um post já publicado, remova a entrada dele de `publicados.json`.

## Configuração única na Meta

1. **Conta profissional.** No app do Instagram: Configurações → Tipo de conta e ferramentas → Mudar para conta profissional → Empresa.
2. **Página do Facebook.** Crie (ou use) uma Página "BoxMonitor" e conecte o Instagram a ela: Meta Business Suite → Configurações → Contas do Instagram → Conectar.
3. **Portfólio.** Em business.facebook.com/settings, no portfólio "BoxMonitor": Contas → Páginas → adicionar a Página; Contas → Contas do Instagram → adicionar o Instagram.
4. **App.** No app Meta "BoxMonitor" (developers.facebook.com), adicione o caso de uso/produto do Instagram (API do Instagram com Login do Facebook).
5. **Usuário do sistema.** Em Usuários → Usuários do sistema → "API BoxMonitor": Atribuir ativos → a Página (criar conteúdo) e a conta do Instagram (criar conteúdo). Depois, **Gerar novo token** para o app BoxMonitor, sem expiração, com as permissões:
   `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`.
   Esse token é novo e separado do `WHATSAPP_ACCESS_TOKEN`; não substitua o do WhatsApp.
6. **Id da conta do Instagram:**
   ```bash
   curl "https://graph.facebook.com/v25.0/me/accounts?fields=name,instagram_business_account&access_token=SEU_TOKEN"
   ```
   O `instagram_business_account.id` (começa com `1784…`) é o `IG_USER_ID`.
7. **Conferir o token:**
   ```bash
   curl "https://graph.facebook.com/v25.0/IG_USER_ID?fields=username&access_token=SEU_TOKEN"
   ```
   Deve responder com o @ do BoxMonitor.
8. **Secrets do GitHub** (o token nunca vai para o código):
   ```bash
   gh secret set IG_USER_ID -R mateusrgiaquinto/boxmonitor-instagram
   gh secret set IG_ACCESS_TOKEN -R mateusrgiaquinto/boxmonitor-instagram
   ```

## Testar

GitHub → Actions → "Publicar no Instagram" → Run workflow com `dry_run` marcado: mostra o que seria publicado, sem chamar a Meta. A execução agendada diária publica de verdade.
