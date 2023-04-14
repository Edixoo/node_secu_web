const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const generateOTP = require('otp-generator');
const { sendMail } = require('./controllers/sendEmail.js')



const app = express();

const pool = new pg.Pool({
    user: 'paul',
    host: 'localhost',
    database: 'formulaire',
    password: 'Paul2003**',
    port: 5432
});


app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.send(`
        <form action="/test" method="get">
        
            <label>Name:</label>
            <input type="text" name="name" /><br />
            <label>Email:</label>
            <input name="email" /><br />
            <input type="submit" value="Submit"/>
        </form>
    `);
});



app.post('/', (req, res) => {

    const name = req.body.name;
    const email = req.params.email;



    // Partie XSS 
    var commentaire_valide = validator.escape(commentaire);
    res.send(commentaire_valide);



    // Partie Injection : on peut injecter
    // const query = `SELECT * FROM personne WHERE nom = '${name}' AND email = '${email}'`;

    // Partie Injection: on ne peut pas injecter
    const query = {
        text: 'SELECT * FROM personne WHERE nom = $1 AND email = $2',
        values: [name, email]
    };

    
    pool.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.send({
                "code": 400,
                "failed": "error ocurred",
                "message": err
            })
        } else {

            res.send(result.rows);
        }
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});


// Requête pour la faille XSS
// Bonjour, <script>alert("bonsoirs")</script> !