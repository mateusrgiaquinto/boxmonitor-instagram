# BoxMonitor Instagram

Artes, legendas e publicação automática do Instagram do BoxMonitor.

- `gerador/conteudo.mjs`: textos de todos os posts (artes, legendas, roteiros dos Reels).
- `gerador/gerar.mjs`: gera `posts/` (PNG + JPEG), `agenda.json` e `CRONOGRAMA.txt`.
- `publicar.mjs`: publica o próximo post vencido da `agenda.json` (1 por execução) e registra em `publicados.json`.
- `.github/workflows/publicar.yml`: roda o `publicar.mjs` todo dia às 12:07 (Brasília).

Posts com `kind: "reel"` em `conteudo.mjs` geram capa e roteiro em `posts/` e entram na agenda, mas só são publicados quando o vídeo existir em `videos/<slug>.mp4` (MP4 1080x1920, até 15 min). Sem o vídeo, o Reel fica aguardando e os outros posts seguem normalmente; se o vídeo chegar depois da data, ele sai na próxima execução. O vídeo é enviado direto para a Meta (upload resumable), sem depender do raw do GitHub. Um post pode ter horário próprio com `publishTime` (ex.: `"15:00:00-03:00"`). Reels saem às 12h de segunda e quarta; o carrossel do mesmo dia vai para as 15h.

## Vídeo dos Reels (HyperFrames)

`npm run video -- <slug>` (ou `npm run video -- --todos`) gera `videos/<slug>.mp4` a partir dos `beats` do Reel em `conteudo.mjs`:

- voz da ElevenLabs por beat (voz fixa em `video/render.mjs`, chave em `ELEVENLABS_API_KEY`); o áudio fica em `video/voz/` e só é gerado de novo quando a fala muda;
- card com o texto grande, legenda da fala e, quando o beat tem `tela`, a tela do BoxMonitor recriada em `video/telas.mjs` (dados fictícios, selo "demonstração");
- efeitos sonoros de `video/sfx/` e trilha de `video/musica/trilha.mp3` (ou `video/musica/<slug>.mp3`), se existir.

O script monta um projeto HyperFrames em `video/build/<slug>/` e renderiza com `npx hyperframes@0.9.8 render`. Precisa de FFmpeg no PATH (`winget install Gyan.FFmpeg`). Para ver antes de renderizar: `npm run video -- <slug> --previa` e, na pasta do projeto, `npx hyperframes@0.9.8 preview`. Ajustes feitos no preview se perdem na próxima geração; o que deve ficar vai para `conteudo.mjs` ou `video/telas.mjs`.

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
