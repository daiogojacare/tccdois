const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { resolveSoa } = require('dns');

app.use(session({secret:'diogoebernardolindos'}));
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));

function conectiondb(){
    var con = mysql.createConnection({
        host: 'localhost', 
        user: 'root',
        password: 'aluno01', 
        database: 'meubanco'
    });

    con.connect((err) => {
        if (err) {
            console.log('Erro na conexão com o banco de dados.', err)
            return
        }
        console.log('Conexão estável!')
    });

    return con;
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/homepage.html');
});

app.get('/views/homepage.html', (req, res)=>{
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});

app.get('/cardapio', (req, res) => {
    res.sendFile(__dirname + '/views/cardapio.html');
});

app.get('/marmitas', (req, res) => {
    res.sendFile(__dirname + '/views/marmitas.html');
});

app.get("/views/homepage.html", function (req, res){
    
    if (req.session.user){
        var con = conectiondb();
        var query2 = 'SELECT * FROM users WHERE email LIKE ?';
        con.query(query2, [req.session.user], function (err, results){
            res.render('/', {message:results});
            
        });
        
    }else{
        res.redirect("/login");
    }
    
});

app.post('/register', function (req, res){

    var username = req.body.nome;
    var pass = req.body.senha;
    var email = req.body.email;
    var localizacao = req.body.localizacao;

    var con = conectiondb();

    var queryConsulta = 'SELECT * FROM users WHERE email LIKE ?';

    con.query(queryConsulta, [email], function (err, results){
        if (results.length > 0){            
            var message = 'E-mail já cadastrado';
            res.render('/login');
        }else{
            var query = 'INSERT INTO users VALUES (DEFAULT, ?, ?, ?, ?)';

            con.query(query, [username, email, localizacao, pass], function (err, results){
                if (err){
                    throw err;
                }else{
                    console.log ("Usuario adicionado com email " + email);
                    res.render('/login');
                }        
            });
        }
    });
}); 

app.post('/log', function (req, res){
    var email = req.body.email;
    var pass = req.body.senha2;
    var con = conectiondb();
    var query = 'SELECT * FROM users WHERE pass = ? AND email LIKE ?';
    
    con.query(query, [pass, email], function (err, results){
        if (results.length > 0){
            req.session.user = email;           
            console.log("Login feito com sucesso!");
            res.render('/', {message:results});
        }else{
            var message = 'Login incorreto!';
            res.render('/login', { message: message });
        }
    });
});


/*
app.post(   /cadastro", (req, res) => {
  const { nome, endereco, idade, cpf } = req.body;
  if (!nome || !endereco || !idade || !cpf) {
    res.status(400).send("Nome e endereço são campos obrigatórios.");
    return;
  }

  const cliente = { nome, endereco, idade, cpf };
  connection.query("INSERT INTO clientes SET ?", cliente, (err, result) => {
    if (err) throw err;
    console.log(`Cliente ${nome} cadastrado com sucesso!`);
    res.redirect("/");
  });
});

*/




app.listen(3000, () => console.log(`Servidor rodando`));