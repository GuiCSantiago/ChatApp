const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(bodyParser.json());
const port = 3000;

// Inicializando o banco de dados
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados', err.message);
    } else {
        console.log('Conectado ao banco de dados em memória.');
        db.serialize(() => {
            db.run(`
                CREATE TABLE Usuarios (
                    identificador TEXT PRIMARY KEY,
                    usuario TEXT NOT NULL UNIQUE
                )
            `);
            db.run(`
                CREATE TABLE Mensagens (
                    MsgId INTEGER PRIMARY KEY AUTOINCREMENT,
                    Msg TEXT NOT NULL,
                    DataHoraMsg TEXT NOT NULL,
                    identificadorUsuarioRemetente TEXT NOT NULL,
                    identificadorUsuarioDestino TEXT,
                    FOREIGN KEY (identificadorUsuarioRemetente)
                    REFERENCES Usuarios (identificador),
                    FOREIGN KEY (identificadorUsuarioDestino)
                    REFERENCES Usuarios (identificador)
                )
            `);
        });
    }
});

// Adiciona um novo usuário
function addUser(usuario, callback) {
    const identificador = `${usuario}-${Date.now()}`;
    db.run(`INSERT INTO Usuarios (identificador, usuario) VALUES (?, ?)`, [identificador, usuario], function(err) {
        callback(err, identificador);
    });
}

// Iniciar Chat
app.post('/iniciaChat', (req, res) => {
    const { usuario } = req.body;
    addUser(usuario, (err, identificador) => {
        if (err) {
            return res.status(400).send('Usuário já em uso');
        } else {
            res.send({ identificador });
        }
    });
});

// Encerrar Chat
app.delete('/encerraChat', (req, res) => {
    const { identificadorUsuario } = req.body;
    db.run(`DELETE FROM Usuarios WHERE identificador = ?`, identificadorUsuario, function(err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            db.run(`DELETE FROM Mensagens WHERE identificadorUsuarioRemetente = ? OR identificadorUsuarioDestino = ?`, [identificadorUsuario, identificadorUsuario], function(err) {
                if (err) {
                    res.status(500).send(err.message);
                } else {
                    res.send('Chat encerrado com sucesso');
                }
            });
        }
    });
});

// Consultar Usuários
app.get('/consultaUsuarios', (req, res) => {
    db.all(`SELECT * FROM Usuarios`, [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.send(rows);
        }
    });
});

// Enviar Mensagem para Todos
app.post('/msgAll', (req, res) => {
    const { identificadorUsuario, msg } = req.body;
    db.all(`SELECT identificador FROM Usuarios`, [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            rows.forEach(user => {
                db.run(`INSERT INTO Mensagens (Msg, DataHoraMsg, identificadorUsuarioRemetente, identificadorUsuarioDestino) VALUES (?, ?, ?, ?)`,
                    [msg, new Date(), identificadorUsuario, user.identificador], (err) => {
                    if (err) {
                        res.status(500).send(err.message);
                    }
                });
            });
            res.send('Mensagem enviada para todos');
        }
    });
});

// Enviar Mensagem Privada
app.post('/msg', (req, res) => {
    const { identificadorUsuario, msg, identificadorUsuarioDestino } = req.body;
    db.run(`INSERT INTO Mensagens (Msg, DataHoraMsg, identificadorUsuarioRemetente, identificadorUsuarioDestino) VALUES (?, ?, ?, ?)`,
        [msg, new Date(), identificadorUsuario, identificadorUsuarioDestino], (err) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.send('Mensagem privada enviada');
        }
    });
});

// Consultar Mensagens
app.get('/consultaMensagens', (req, res) => {
    const { identificadorUsuario } = req.query;
    db.all(`SELECT * FROM Mensagens WHERE identificadorUsuarioDestino = ? OR identificadorUsuarioDestino IS NULL ORDER BY MsgId DESC LIMIT 50`, identificadorUsuario, (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.send(rows);
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
