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

    var usuarionome = req.body.nome;
    var senha = req.body.senha;
    var email = req.body.email;
    var localizacao = req.body.localizacao;

    var con = conectiondb();

    var queryConsulta = 'SELECT * FROM users WHERE email LIKE ?';

    con.query(queryConsulta, [email], function (err, results){
        if (results.length > 0){            
            var message = 'E-mail já cadastrado';
            res.redirect('/login');
        }else{
            var query = 'INSERT INTO users VALUES (DEFAULT, ?, ?, ?, ?)';

            con.query(query, [usuarionome, email, localizacao, senha], function (err, results){
                if (err){
                    throw err;
                }else{
                    console.log ("Usuario adicionado com email " + email);
                    res.redirect('/login', { message: message });
                }        
            });
        }
    });
}); 

app.post('/log', function (req, res){
    var email = req.body.email;
    var senha = req.body.senha2;
    var con = conectiondb();
    var query = 'SELECT * FROM users WHERE pass = ? AND email LIKE ?';
    
    con.query(query, [senha, email], function (err, results){
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
/*
// ADICIONAR PRODUTOS NO CARDÁPIO
  
  app.get("/addcardapio", (req, res) => {
    res.sendFile(__dirname + "/views/addcardapio.html");
  });
  
  app.post("/addcardapio", (req, res) => {
    const { id, nome, quantidade, valor } = req.body;
    if (!id || !descricao || !quantidade || !valor) {
      res.status(400).send("Todos os campos são obrigatórios.");
      return;
    }
  
    const produtos = { id, nome, quantidade, valor };
    connection.query("INSERT INTO produtos SET ?", produtos, (err, result) => {
      if (err) throw err;
      console.log(`Produto ${id} cadastrado com sucesso!`);
      res.redirect("/");
    });
  });
  
  // Rota para processar a listagem
  app.get('/cardapio', (req, res) => {
  
    // Consulta no banco de dados
    connection.query(`SELECT * FROM produtos`, (error, results, fields) => {
      if (error) throw error;
  
      // Exibição dos resultados
      let html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Consulta de Produtos</title>
          </head>
          <body>
            <h1>Produtos encontrados</h1>
            <table>
              <tr>
                <th>ID</th>
                <th>Descrição</th>
                <th>Quantidade</th>
                <th>Valor</th>
              </tr>
      `;
  
      results.forEach((produtos) => {
        html += `
          <tr>
            <td>${produtos.id}</td>
            <td>${produtos.descricao}</td>
            <td>${produtos.quantidade}</td>
            <td>${produtos.valor}</td>
          </tr>
        `;
      });
  
      html += `
            </table>
            <a href="/">Voltar</a>
          </body>
        </html>
      `;
  
      res.send(html);
    });
  });
  
  // Rota para exibir o formulário de consulta
  app.get('/consultaprodutos', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Consulta de produtos</title>
        </head>
        <body>
          <h1>Consulta de Produtos</h1>
          <form method="POST" action="/consultaprodutos">
            <label for="id">ID:</label>
            <input type="text" id="id" name="id"><br><br>
            <button type="submit">Consultar</button>
          </form>
        </body>
      </html>
    `);
  });
  
  // Rota para processar a consulta
  app.post('/consultaprodutos', (req, res) => {
    //const nome = req.body.nome;
    const {
      id
    } = req.body;
    //const endereco = req.body.endereco;
  
    // Consulta no banco de dados
    connection.query(`SELECT * FROM produtos WHERE id LIKE '%${id}%'`, (error, results, fields) => {
      if (error) throw error;
  
      // Exibição dos resultados
      let html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Produtos</title>
          </head>
          <body>
            <h1>Produtos encontrados</h1>
            <table>
              <tr>
                <th>ID</th>
                <th>Descrição</th>
                <th>Quantidade</th>
                <th>Valor</th>
              </tr>
      `;
  
      results.forEach((produtos) => {
        html += `
          <tr>
            <td>${produtos.id}</td>
            <td>${produtos.descricao}</td>
            <td>${produtos.quantidade}</td>
            <td>${produtos.valor}</td>
          </tr>
        `;
      });
  
      html += `
            </table>
            <a href="/">Voltar</a>
          </body>
        </html>
      `;
  
      res.send(html);
    });
  });
  
  connection.connect((err) => {
    if (err) throw err;
    console.log("Conectado ao banco de dados MySQL!");
  });
*/

app.listen(3000, () => console.log(`Servidor rodando`));