# KyuDan — Gestão ABK (MVC)

**KyuDan** é o sistema de gestão da **Associação Blumenauense de Karatê (ABK)**. Este repositório
(`kyudan-fe`) contém o front-end do **MVC (Minimum Viable Concept)**: um protótipo visual, com dados
mocados e arquitetura genérica, que tangibiliza o valor e a usabilidade do produto antes do backend.

> Estética inspirada no Karatê: fundo branco (o kimono), tipografia e CTAs em preto (a faixa preta/Dan),
> e a progressão de faixas **FCK/CBK** como linguagem visual de status e conquistas.

## ✨ Funcionalidades (por role)

O app é **Mobile First** e adapta a navegação inferior à persona ativa (troca no header).

| Role | "O quê" | Telas |
|------|---------|-------|
| **Aluno** — O Caminho | Evolução pessoal | Dashboard de progresso + currículo técnico, O Cartel (graduações/competições), carteira digital, central financeira (copiar PIX) |
| **Professor** — O Tatame | Operação na ponta | Visão do Dia, chamada rápida (tap = presença, alertas por aluno), avaliação de currículo, diário de bordo, indicação ao exame |
| **Responsável** — A Base | Acompanhar dependentes | Family View, home de atrito zero + financeiro consolidado, evolução pedagógica, autorizações digitais, calendário de presença |
| **Gestão** — A Cúpula | Visão macro | Painel executivo (busca global, alertas, métricas, saúde dos pólos), pólos, filiações FCK/CBK + cobrança em lote, eventos, financeiro/inventário |

## 🧱 Stack & Arquitetura

- **Angular 20** (standalone, **signals**, zoneless, SSR/Express com render client-side).
- **Tailwind CSS + SCSS** — design system de faixas via tokens (`belt-*`) e superfícies tematizáveis
  (light padrão / **dark mode** nativo).
- **Firebase / Firestore** (projeto `kyudan-da348`) como BaaS temporário.
- **Padrão Repository/Adapter:** os componentes consomem apenas interfaces `I*Service`
  (`src/app/core/contracts`). A implementação ativa é escolhida em `environment.dataSource`:
  - `firebase` → `Firebase*Service` (isola todo o Firestore);
  - `mock` → repositórios in-memory (roda 100% offline).

  Trocar para uma API NestJS no futuro = criar `Api*Service` e ajustar `provideData()` — **sem tocar na UI**.

### Estrutura

```
src/app/
  core/            # models, contracts (I*Service), services (theme, belt lineage, session),
                   # firebase/ (impl. Firestore), data/ (mock dataset + impl. in-memory + provideData)
  shared/ui/       # design system (dumb components): belt-badge, belt-shelf, progress-bar,
                   # app-card, alert-chip, button, search-bar, digital-card, theme-toggle, bottom-nav, icon
  shared/util/     # formatação pt-BR e datas
  layout/          # app shell (header + nav adaptativa) e nav-config
  features/        # aluno, professor, responsavel, gestao (cada um com store + pages lazy)
```

## 🚀 Como rodar

```bash
npm install
npm start           # http://localhost:4200
```

### Fonte de dados

Por padrão o app usa **Firestore** (`environment.dataSource = 'firebase'`). Para vê-lo com dados,
**popule o Firestore uma vez**:

```bash
npm run seed        # grava o dataset mocado da ABK no projeto kyudan-da348
```

> Para uma demo **offline instantânea** (sem rede/seed), altere `dataSource` para `'mock'`
> em `src/environments/environment.ts`.

### Regras do Firestore

Alterações em `firestore.rules` exigem deploy manual:

```bash
firebase deploy --only firestore:rules
```

## 🧪 Build & testes

```bash
npm run build       # build de produção (AOT)
npm test            # testes unitários (Karma/Jasmine)
```

## 🎨 Sistema de cores (linhagem FCK/CBK)

`Branca → Amarela → Vermelha → Laranja → Verde → Roxa → Marrom → Preta (Dan)` — usadas com parcimônia,
apenas em status, badges de conquista e sinalizações.

---

_MVC — Spec 001. Dados mocados; sem autenticação real (personas selecionáveis no header)._
