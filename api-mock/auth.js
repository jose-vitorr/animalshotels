// Função para gerar token fake (simples para testes)
function generateToken(user) {
  // Token fake: apenas base64 do email (NÃO use isso em produção!)
  return Buffer.from(JSON.stringify({ 
    id: user.id, 
    email: user.email 
  })).toString('base64');
}

// Função para validar token
function validateToken(token) {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    return decoded;
  } catch (error) {
    return null;
  }
}

// Middleware de autenticação
module.exports = (req, res, next) => {
  // ============================================
  // ROTA DE LOGIN
  // ============================================
  if (req.method === 'POST' && req.path === '/auth/login') {
    const { email, password } = req.body;

    // Buscar usuário no db.json
    const db = require('./db.json');
    const user = db.users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return res.status(401).json({
        message: 'Email ou senha incorretos',
      });
    }

    // Gerar token
    const token = generateToken(user);

    // Retornar usuário (sem senha) e token
    return res.status(200).json({
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
      token: token,
    });
  }

  // ============================================
  // ROTA DE REGISTRO
  // ============================================
  if (req.method === 'POST' && req.path === '/auth/register') {
    const { nome, email, password } = req.body;

    // Validações básicas
    if (!nome || !email || !password) {
      return res.status(400).json({
        message: 'Nome, email e senha são obrigatórios',
      });
    }

    // Ler arquivo db.json
    const fs = require('fs');
    const dbPath = './db.json';
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    // Verificar se email já existe
    const emailExists = db.users.some((u) => u.email === email);
    if (emailExists) {
      return res.status(400).json({
        message: 'Este email já está cadastrado',
      });
    }

    // Criar novo usuário
    const newUser = {
      id: String(Date.now()), // ID baseado em timestamp
      nome,
      email,
      password,
    };

    // Adicionar ao banco
    db.users.push(newUser);

    // Salvar no arquivo
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    // Gerar token
    const token = generateToken(newUser);

    // Retornar usuário e token
    return res.status(201).json({
      user: {
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
      },
      token: token,
    });
  }

  // ============================================
  // VALIDAR TOKEN NAS OUTRAS ROTAS
  // ============================================
  
  // Rotas públicas (não precisam de autenticação)
  const publicRoutes = ['/auth/login', '/auth/register'];
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  // Pegar token do header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      message: 'Token não fornecido',
    });
  }

  // Formato: "Bearer TOKEN"
  const token = authHeader.split(' ')[1];

  // Validar token
  const decoded = validateToken(token);
  
  if (!decoded) {
    return res.status(401).json({
      message: 'Token inválido',
    });
  }

  // Token válido, continuar
  next();
};