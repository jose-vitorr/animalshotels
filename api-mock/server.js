const jsonServer = require('json-server');
const auth = require('./auth');

// Criar servidor
const server = jsonServer.create();

// Usar middlewares padrão
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// ============================================
// CONFIGURAÇÃO DE CORS 
// ============================================
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Permitir qualquer origem
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Responder preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Middleware para fazer parse do body
server.use(jsonServer.bodyParser);

// Middleware de autenticação (ANTES do router!)
server.use(auth);

// Middlewares padrão (CORS, static files, etc)
server.use(middlewares);

// Usar o router do json-server
server.use(router);

// Porta
const PORT = 3000;

// Iniciar servidor
server.listen(PORT, () => {
  console.log(` API Mock rodando em http://localhost:${PORT}`);
  console.log(` Endpoints disponíveis:`);
  console.log(`   POST   http://localhost:${PORT}/auth/login`);
  console.log(`   POST   http://localhost:${PORT}/auth/register`);
  console.log(`   GET    http://localhost:${PORT}/tutores`);
  console.log(`   POST   http://localhost:${PORT}/tutores`);
  console.log(`   PUT    http://localhost:${PORT}/tutores/:id`);
  console.log(`   DELETE http://localhost:${PORT}/tutores/:id`);
  console.log(`   GET    http://localhost:${PORT}/animais`);
  console.log(`   POST   http://localhost:${PORT}/animais`);
  console.log(`   PUT    http://localhost:${PORT}/animais/:id`);
  console.log(`   DELETE http://localhost:${PORT}/animais/:id`);
});