const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Databasse = require("better-sqlite3")
const db = new Databasse('my-database.db')
const crypto = require('crypto');
const nodemailer = require('nodemailer')
const session = require('express-session');
const { error } = require('console');
require('dotenv').config()
const SQLiteStore = require('connect-sqlite3')(session);



// Cria a tabela de usuários, se não existir

db.prepare(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
)`).run();

try {
    db.prepare(`ALTER TABLE usuarios ADD COLUMN reset_token TEXT`).run();
    console.log('Coluna reset_token adicionada com sucesso');
} catch (error) {
    console.log('Coluna reset_token já existe');
}

// Tenta adicionar a coluna token_expiration
try {  
    db.prepare(`ALTER TABLE usuarios ADD COLUMN token_expiration INTEGER`).run();
    console.log('Coluna token_expiration adicionada com sucesso');
} catch (error) {
    console.log('Coluna token_expiration já existe');
}
db.prepare(`
        CREATE TABLE IF NOT EXISTS projetos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuarios_id INTEGER NOT NULL,
            nome VARCHAR(100) NOT NULL,
            orcamento DECIMAL(10,2),
            descricao TEXT,
            data DATE, 
            categoria VARCHAR(30),
            FOREIGN KEY(usuarios_id) REFERENCES usuarios(id)
        )
    `).run()
    
db.pragma('foreign_keys = ON');
console.log('Foreign Keys ativadas!');

const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    store: new SQLiteStore({ db: 'sessions.sqlite' }),
    secret: 'naturo',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}))

app.post('/api/criar-conta', (req, res) => {
    const {email, senha} = req.body
    console.log('dados recebidos:', email, senha);

    try {
        const existe = db.prepare(`
                SELECT * FROM usuarios WHERE email = ?
            `).get(email)

        if(existe) {
    
            console.log('Email ja cadastrado');
            return res.status(400).json({ error: 'Email ja cadastrado'})
            
        } else {
            const cadastrarBanco = db.prepare(`
                    INSERT INTO usuarios (email, senha) VALUES (?, ?)
                `); cadastrarBanco.run(email, senha)

            console.log('Usuario cadastrado com sucesso');
            return res.json({message: 'Usuario cadastrado com sucesso'})
            
        }
    } catch (error) {
        console.error('Erro ao processar dados:', error);
        res.status(500).json({ error: 'Erro interno no servidor'})
    }    

})
app.post('/api/login', (req, res) => {
    const {email, senha} = req.body
    console.log('dados recebidos:', email, senha);

    if (!email || ! senha) {
        console.log('Email e senha sao obrigatorios');
        return res.status(400).json({ error: 'Email e senha sao obrigatorios'})
    } 
    if (!email.includes('@')) {
        console.log('Email com formato invalido');
        return res.status(400).json({ error: 'Email com formato invalido'})
    } 
    try {
        const usuario  = db.prepare(`
                SELECT * FROM usuarios WHERE email = ? AND senha = ?
            `).get(email, senha)
        
        if (!usuario) {
            console.log('Email ou senha incorretos')
            return res.status(400).json({error: 'Email ou senha incorretos'})
        }
        else {
            req.session.userId = usuario.id
            console.log('id usuario:', req.session.userId)
            console.log('Login realizado com sucesso')
            return res.json({msg: 'Login realizado com sucesso'})
        }
    } catch (error) {
        console.error('Erro ao processar dados:', error);
        res.status(500).json({ error: 'Erro interno no servidor'})
    }
})
app.post('/api/esqueci-senha', async (req,res) => {
    const {email} = req.body
    console.log('dados recebidos:', email);

    if(!email) {
        console.log('Email é obrigatorio')
        return res.status(400).json({error: 'Email é obrigatorio'})
    }

    try {
        const email_existe = db.prepare(`
                SELECT * FROM usuarios WHERE email = ?
            `).get(email)

        if (!email_existe) {
            console.log('Email nao cadastrado');
            return res.status(400).json({ error: 'Email nao cadastrado'})
        }   

        function gerarToken() { // gera um token numerico de 6 digitos
            return crypto.randomInt(100000, 999999).toString();   

        }
        function criarToken() { // cria e salva o token no banco de dados
            const token = gerarToken() // armazena token na variavel
            const expiration  = Date.now() + 10 * 60 * 1000 // 10 minutos
            console.log('Token criado:', token, 'Expira em:', new Date(expiration).toLocaleString());
            
            const salvarToken = db.prepare(`
                    UPDATE usuarios SET reset_token = ?, token_expiration = ? WHERE email = ? 
                `); salvarToken.run(token, expiration, email) // salva o token e a expiração no banco de dados para o email fornecido
            console.log('Token salvo no banco de dados para o email:', email);    
            return token // retorna o token gerado para ser usado no envio do email
        }

        async function enviarEmail(token) {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.Email_user,
                        pass: process.env.Email_pass
                    }
                })
                const link = `http://localhost:3000/ResetSenha?token=${token}`
                const config_email = {
                    from: process.env.Email_user,
                    to: email,
                    subject: 'Clique no link abaixa para redefinir sua senha',
                    html: `
                        <p>Você solicitou a redefinição de senha.</p>
                        <p>Clique no link abaixo para redefinir:</p>
                        <a href="${link}">${link}</a>
                        <p>Esse link é válido por 10 minutos.</p>
                    `,
                    }

                const enviar = await transporter.sendMail(config_email)
                console.log('Email enviado:', enviar.response)
                return res.json({message: 'Email enviado com sucesso'})

            } catch (error) {
                console.error('Erro ao enviar email:', error)
                return res.status(500).json({error: 'Erro ao enviar email'})
            }           
        }

        const token = criarToken()
        await enviarEmail(token)

    } catch (error) {
        console.error('Erro ao processar dados:', error);
        res.status(500).json({ error: 'Erro interno no servidor'})
    }
})

app.post('/api/reset-senha', (req, res) => {
    const {senha, token} =req.body
    console.log('dados recebidos:', senha, token);

    if(!token) {
        return res.status(400).json({error: 'Token é obrigatorio'})
    }

    const user = db.prepare(`
            SELECT * FROM usuarios WHERE reset_token = ?
        `).get(token) // busca o usuario com o token fornecido

    if (!user) {
        return res.status(400).json({error: 'Token Inavalido'}) // se nao encontrar o token, retorna erro
    } 
    if(user.token_experaation < Date.now())   {
        return res.status(400).json({error: 'Token expirado'}) // se o token expirou, retorna erro
    }

    try {
        db.prepare(`
                UPDATE usuarios SET senha = ?, reset_token = NULL, token_expiration = NULL WHERE id = ?
            `).run(senha, user.id) // atualiza a senha do usuario e remove o token e a expiração
        console.log('Senha redefinida com sucesso para o usuario:', user.email);
        return res.json({message: 'Senha redefinida com sucesso'})    
    } catch (error) {
        console.error('Erro na alteração da senha:', error);
        return res.status(500).json({error: 'Erro ao redefinir a senha'})
    }
})
app.post('/api/cadastrar-projeto', (req,res) => {
    const {nome,orcamento,descricao,data,categoria} = req.body
    const orcamento_Num = parseInt(orcamento)
    console.log('dados recebidos:',nome,orcamento_Num,descricao,data,categoria)

    const userId_projetos = req.session.userId
    console.log('id recebido:',userId_projetos)

    const User_existe = db.prepare(`
            SELECT * FROM usuarios WHERE id = ?
        `).get(userId_projetos)

    if(!User_existe) {
        console.log('usuario nao econtrado')
        return res.status(400).json({Error: 'usario não encontado'})
    }  
    
    try {
        db.prepare(`
                INSERT INTO projetos (usuarios_id, nome,orcamento,descricao,data,categoria) VALUES (?,?,?,?,?,?)
            `).run(userId_projetos,nome,orcamento_Num,descricao,data,categoria)

        console.log('projeto cadastro com sucesso')
        return res.json({menssage: 'projeto cadastro com sucesso'})   
    } catch (error) {
        console.error('Erro ao cadastra o projeto no banco de dados', error)
        return res.status(500).json({error: 'Erro ao cadastra o projeto no banco de dados'})
    }

})
app.post("/api/buscar-projeto", (req, res) => {
  const { projeto } = req.body;
  const id_buscar_projeto = req.session.userId;

  console.log("Dado recebido:", projeto);

  if(projeto.trim() == 'Todos os projetos') {
    try {
        const todos_projetos = db.prepare(`
                SELECT * FROM projetos WHERE usuarios_id = ?
            `).all(id_buscar_projeto)
        
        console.log('Projetos encontrados:', todos_projetos)    
       return res.json(todos_projetos)    
    } catch (error) {
        console.error('erro ao busca todos os projetos do usuario', error)
        return res.status(500).json({error: 'nenhum projeto encontrado'})
    }        
  }

  if (!id_buscar_projeto) {
    console.error("Erro: usuário não autenticado");
    return res.status(400).json({ error: "Usuário não autenticado" });
  }

  if (!projeto || projeto.trim() === "") {
    console.log('Variável "projeto" vazia');
    return res.status(400).json({ erro: 'Variável "projeto" não contém dados' });
  }

  try {
    const likeValue = `%${projeto}%`;

    // Busca nomes das colunas
    const colunas = db.prepare("PRAGMA table_info(projetos)").all();
    const nomesColunas = colunas.map(c => c.name).filter(c => c !== "usuarios_id");

    const whereClause = nomesColunas.map(c => `LOWER(${c}) LIKE LOWER(?)`).join(" OR ");
    const values = nomesColunas.map(() => likeValue);

    const query = `
      SELECT * FROM projetos
      WHERE usuarios_id = ? AND (${whereClause})
    `;

    const stmt = db.prepare(query);
    const resultados = stmt.all(id_buscar_projeto, ...values);

    if(resultados.length == 0) {
        console.log('Projeto não encontrado')
        return res.status(400).json({error: 'Projeto não encontrado'})
    }

    return res.json(resultados);

  } catch (error) {
    console.error("Erro ao buscar projeto no banco:", error);
    return res.status(500).json({error: "Error interno no servidor" });
  }
});
app.post('/busca/edita/projeto', (req, res) => {
    const {id} = req.body
    console.log('id do projeto:',id)

    try {
        const busca_projeto = db.prepare(`
                SELECT * FROM projetos WHERE id = ? 
            `).get(id)
        
        if(!busca_projeto) {
            console.log('Projeto não encontrado')
            return res.status(400).json({error: 'projeto não encontrado'})
        }
        console.log('projeto encontrado:', busca_projeto)
        return res.json([busca_projeto])
    } catch (error) {
        console.error('erro ao realiza busca no banco de dados')
        return res.status(500).json({error: 'error interno no servidor'})
    }   
})

const port =  3001

app.listen(port, () => {
    console.log(`servidor rodando na porta ${port}`)
})    
