var mysql = require('mysql2');
var bcrypt = require('bcrypt-nodejs');

// paramètres de la requêtes

var username = req.body.username;
var passwordHash = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync());

/* Créer une connexion au base de données MYSQL*/
var connection = mysql.createConnection({
host : 'localhost',
user : 'db_user',
password : 'secret',
database : 'node_app_db'
});
connection.connect();

/* Executer une requêtes préparées avec les données de l’utilisateur*/
var query = 'SELECT * FROM accounts WHERE username=? AND password=?';
connection.query(query, [username, passwordHash],
function (err, rows, fields) {
console.log("Results = " + JSON.stringify(rows));
});
connection.end();