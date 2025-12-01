# 🐾 AnimalHotels

Sistema de gerenciamento de hospedagem para animais (Airbnb para pets).

## 📋 Pré-requisitos

- Node.js 18+ ([Download](https://nodejs.org/))
- npm (vem com Node.js)
- Git ([Download](https://git-scm.com/))

## 🚀 Como Rodar o Projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/jose-vitorr/AnimalsHotels.git
cd AnimalsHotels
```

### 2. Instalar dependências do Front-end
```bash
cd Frontend
npm install
```

### 3. Instalar dependências da API Mock
```bash
cd ../api-mock
npm install
```

### 4. Rodar o projeto

Você precisa de **2 terminais**:

**Terminal 1 - API Mock:**
```bash
cd api-mock
npm start
```

A API estará disponível em: `http://localhost:3000`

**Terminal 2 - Front-end:**
```bash
cd client
npm run dev
```

O front-end estará disponível em: `http://localhost:5173`

## 🔑 Credenciais de Teste

- **Email:** admin@animalshotels.com
- **Senha:** 123456

## 📁 Estrutura do Projeto
```
AnimalsHotels/
├── Frontend/              # Front-end React + TypeScript
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── contexts/    # Context API
│   │   ├── pages/       # Páginas
│   │   ├── services/    # Integração com API
│   │   └── types/       # Tipos TypeScript
│   └── package.json
├── api-mock/            # API Mock (json-server)
│   ├── db.json          # Banco de dados
│   ├── auth.js          # Middleware de autenticação
│   └── server.js        # Servidor
└── README.md
```

## 🛠️ Tecnologias Utilizadas

### Front-end
- React 18
- TypeScript
- Vite
- React Router DOM
- Axios
- React Hook Form
- CSS Modules

### Back-end (Mock)
- json-server
- Node.js

## 📝 Funcionalidades

- [x] Autenticação (Login/Registro)
- [x] CRUD de Tutores
- [x] CRUD de Animais
- [x] Relação Tutor ↔ Animais
- [x] Rotas Protegidas
- [ ] Upload de fotos
- [ ] Filtros e busca

## 👥 Autores

José Vitor - [jose-vitorr](https://github.com/jose-vitorr)\n
Luana - [@seu_usuario](https://github.com/seu_usuario)\n
Riquelme - [@seu_usuario](https://github.com/seu_usuario)

## 📄 Licença

Este projeto é acadêmico (IFPI - ADS).
