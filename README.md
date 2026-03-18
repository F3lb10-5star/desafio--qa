# 🎭 Playwright E2E Testing Suite
Este projeto contém a suíte de testes automatizados ponta a ponta (E2E) para o sistema [Nome do Sistema]. Desenvolvido com Playwright e TypeScript, o projeto visa garantir a estabilidade das principais funcionalidades, como fluxos de login e CRUD.

🚀 Pré-requisitos
Antes de começar, você precisará ter instalado em sua máquina:

  - Node.js (v18 ou superior)

  - npm ou yarn

## 📦 Instalação
Clone o repositório:

Bash
git clone https://github.com/F3lb10-5star/desafio--qa.git
cd desafio_qa

## Instale as dependências:

Bash
```npm install```

Instale os navegadores do Playwright:

Bash
```npx playwright install --with-deps```

## 🛠️ Executando os Testes
Interface de Usuário (UI Mode)
Melhor para desenvolvimento e debug visual:

Bash
```npx playwright test --ui```

Linha de Comando (Headless)
Ideal para integração contínua (CI):

Bash
```npx playwright test```

Rodando um teste específico
Bash
```npx playwright test tests/login.spec.ts```
