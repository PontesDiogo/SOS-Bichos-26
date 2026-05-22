# 🐾 SOS Bichos

Sistema web acadêmico para registro, acompanhamento e gestão de denúncias envolvendo animais.

O **SOS Bichos** foi desenvolvido com o objetivo de aproximar a população dos responsáveis pelo cuidado animal, oferecendo uma plataforma simples e organizada para registrar ocorrências como maus-tratos, abandono, animais feridos, infestações e situações relacionadas à saúde pública.

A aplicação permite que usuários registrem denúncias com descrição, localização e imagens, enquanto administradores podem acompanhar os casos, atualizar status, registrar feedbacks e consultar relatórios gerenciais.

---

## 📌 Sobre o projeto

O projeto surgiu como uma proposta acadêmica para melhorar a comunicação entre cidadãos e órgãos responsáveis pelo atendimento de ocorrências envolvendo animais.

A ideia central é transformar denúncias dispersas em informações organizadas, acessíveis e úteis para análise, acompanhamento e tomada de decisão.

Com o SOS Bichos, o usuário pode:

- registrar uma denúncia;
- informar localização manualmente, por CEP ou mapa;
- anexar imagens da ocorrência;
- acompanhar o status da denúncia;
- visualizar feedbacks da administração;
- editar ou cancelar denúncias enquanto estiverem pendentes.

Já o administrador pode:

- visualizar todas as denúncias cadastradas;
- buscar e filtrar ocorrências;
- analisar detalhes da denúncia;
- visualizar mídias anexadas;
- atualizar status;
- registrar histórico de atendimento;
- consultar relatórios e indicadores;
- exportar dados para apoio à gestão.

---

## 🖼️ Preview

> https://sos-bichos.netlify.app/
---

## 🚀 Funcionalidades

### 👤 Usuário

* Cadastro de conta
* Login
* Recuperação e redefinição de senha
* Aceite da Política de Privacidade
* Perfil do usuário
* Upload de foto de perfil
* Alteração de senha
* Registro de denúncias
* Envio de denúncia anônima
* Upload de até 2 imagens por ocorrência
* Seleção de endereço manual
* Busca de endereço por CEP
* Marcação de localização no mapa
* Acompanhamento das próprias denúncias
* Visualização de histórico e feedbacks
* Edição de denúncias pendentes
* Cancelamento de denúncias pendentes

### 🛠️ Administrador

* Painel administrativo
* Visualização de todas as denúncias
* Busca por palavras-chave
* Filtros por status e tipo
* Paginação de denúncias
* Destaque para denúncias abertas há mais tempo
* Visualização detalhada da ocorrência
* Carrossel de mídias anexadas
* Atualização de status
* Registro de feedbacks da denúncia
* Histórico de atualizações
* Visualização de responsável/contato interno
* Acesso a relatórios gerenciais

### 📊 Relatórios

* Visão geral das denúncias
* Indicadores por status
* Indicadores por tipo de ocorrência
* Distribuição por bairro/região
* Mapa com localização das denúncias
* Filtros por período, status, tipo e palavras-chave
* Exportação em CSV
* Exportação em PDF

### 🌐 Home pública

* Landing page institucional
* Explicação do projeto
* Seções sobre funcionamento da plataforma
* Orientações para denúncia
* Acesso à Política de Privacidade
* Chamada para login/cadastro

---

## 🧭 Fluxo principal do sistema

### Fluxo do usuário

```txt
Home pública
↓
Login ou cadastro
↓
Home logada
↓
Registrar denúncia
↓
Informar descrição, tipo, localização e imagens
↓
Acompanhar status em Minhas Denúncias
```

### Fluxo do administrador

```txt
Login como administrador
↓
Painel ADM
↓
Visualizar denúncias
↓
Analisar detalhes e mídias
↓
Atualizar status
↓
Registrar feedback
↓
Consultar relatórios
```

---

## 🧱 Tecnologias utilizadas

### Front-end

* React
* TypeScript
* Vite
* CSS Modules/Custom CSS
* React Leaflet
* Leaflet
* Recharts

### Back-end e serviços

* Supabase Auth
* Supabase Database
* Supabase Storage
* Row Level Security, RLS
* Netlify para deploy

### APIs e recursos externos

* ViaCEP para busca de endereço por CEP
* OpenStreetMap via Leaflet

---

## 🗂️ Estrutura do projeto

Estrutura geral simplificada:

```txt
src/
├── assets/
│   └── images/
│       ├── carousel/
│       └── logo-sos-bichos-icon.png
│
├── components/
│   ├── denuncia/
│   │   ├── DenunciaForm.tsx
│   │   ├── DenunciaList.tsx
│   │   ├── DenunciaCard.tsx
│   │   ├── DenunciaListItem.tsx
│   │   ├── DenunciaMediaCarousel.tsx
│   │   └── PhotoUpload.tsx
│   │
│   ├── endereco/
│   │   └── EnderecoModal.tsx
│   │
│   ├── home/
│   │   └── HomeNewsCarousel.tsx
│   │
│   └── layout/
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       ├── Banner.tsx
│       └── PageContainer.tsx
│
├── hooks/
│   ├── useAuth.ts
│   └── useDenuncia.ts
│
├── lib/
│   └── supabaseClient.ts
│
├── pages/
│   ├── PublicHomePage.tsx
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── RecuperarSenhaPage.tsx
│   ├── RedefinirSenhaPage.tsx
│   ├── PerfilPage.tsx
│   ├── MinhasDenunciasPage.tsx
│   ├── AdminPage.tsx
│   ├── RelatoriosPage.tsx
│   └── PoliticaPrivacidadePage.tsx
│
├── services/
│   ├── denunciaService.ts
│   ├── denunciaMidiaService.ts
│   ├── feedbackService.ts
│   └── storageService.ts
│
├── styles/
│   └── layout.css
│
├── types/
│   ├── denuncia.ts
│   ├── denunciaMidia.ts
│   ├── endereco.ts
│   └── feedback.ts
│
├── utils/
│   ├── constants.ts
│   ├── denunciaVisual.ts
│   └── formatters.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🗃️ Principais tabelas do banco

### `denuncias`

Armazena as ocorrências registradas pelos usuários.

Campos principais:

```txt
id
resumo
descricao
tipo
status
endereco
bairro
cidade
estado
cep
latitude
longitude
foto_url
anonimo
user_id
nome_usuario
created_at
```

### `denuncia_midias`

Armazena as mídias vinculadas às denúncias.

```txt
id
denuncia_id
url
tipo
nome_arquivo
ordem
created_at
```

### `denuncia_feedbacks`

Armazena o histórico de atualizações feito pela administração.

```txt
id
denuncia_id
status_novo
descricao
proxima_acao
colaborador_nome
colaborador_contato
created_at
```

---

## 🔐 Segurança

O projeto utiliza autenticação pelo Supabase Auth e regras de acesso com Row Level Security.

A lógica esperada é:

* usuários comuns visualizam apenas suas próprias denúncias;
* administradores visualizam todas as denúncias;
* usuários podem editar/cancelar apenas denúncias pendentes;
* mídias são vinculadas às denúncias correspondentes;
* ações administrativas ficam restritas a contas com papel de admin.

---

## ⚙️ Como executar o projeto localmente

### 1. Clone o repositório

```bash
git clone https://github.com/PontesDiogo/SOS-Bichos-26.git
```

### 2. Acesse a pasta do projeto

```bash
cd SOS-Bichos-26
```

Caso o front-end esteja dentro de uma subpasta:

```bash
cd frontend
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do front-end:

```env
VITE_SUPABASE_URL=SUA_URL_DO_SUPABASE
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLIC
```

### 5. Execute o projeto

```bash
npm run dev
```

A aplicação ficará disponível em:

```txt
http://localhost:5173
```

---

## 🧪 Scripts disponíveis

```bash
npm run dev
```

Executa o projeto em ambiente de desenvolvimento.

```bash
npm run build
```

Gera a versão de produção.

```bash
npm run preview
```

Executa localmente a versão de produção gerada pelo build.

---

## 📦 Deploy

O projeto pode ser publicado na Netlify.

Configuração recomendada:

```txt
Build command: npm run build
Publish directory: dist
```

As variáveis de ambiente também devem ser configuradas no painel da Netlify:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

---


## 📍 Status do projeto

O projeto está em desenvolvimento acadêmico e já conta com os principais fluxos funcionais implementados:

* autenticação;
* registro de denúncias;
* upload de imagens;
* painel administrativo;
* acompanhamento por status;
* relatórios;
* exportação de dados;
* home pública;
* home logada;
* política de privacidade;
* layout responsivo em evolução.

---

## 🧩 Melhorias futuras

Algumas evoluções previstas ou possíveis:

* feed de postagens administrado pelo painel ADM;
* carrossel de notícias gerenciável pelo administrador;
* suporte a vídeos nas denúncias;
* integração com ONGs e demais orgãos;
* módulo de adoção de animais;
* notificações por e-mail;
* templates personalizados de e-mail;
* exportação XML;
* dashboard avançado por região;
* mapa de calor;
* melhorias de acessibilidade;
* PWA para uso em dispositivos móveis.

---

## 👨‍💻 Autor

Desenvolvido por **Diogo Garcia** e Igor Gabriel como projeto acadêmico.

GitHub: [PontesDiogo](https://github.com/PontesDiogo) e [IgorGabriel23](https://github.com/IgorGabriel23)

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.

Caso deseje reutilizar ou adaptar alguma parte, consulte o autor do projeto.


