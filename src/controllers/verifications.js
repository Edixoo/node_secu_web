const generateOTP = require('otp-generator');
const { sendMail } = require('./sendEmail');
const { validationResult } = require('express-validator');
const pg = require('pg');

const pool = new pg.Pool({
    user: 'marine',
    host: '172.31.62.53',
    database: 'formulaire',
    password: 'marine1107',
    port: 5432
});



const verificationIdentite = (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.render("authform.pug", { title: "Formulaire de connexion" });
        return;
    }

    // console.log(req.body)
    const email = req.body.mail
    const password = req.body.password

    const OTP = generateOTP.generate(6)
    const t = sendMail({ 'mail': email, 'otp': OTP });


    const query = {
        text: 'UPDATE identite_personne SET otp = $1 WHERE mail = $2;',
        values: [OTP, email]
    };


    pool.query(query);


    res.redirect('/validation')
}

module.exports = verificationIdentite




// CREATE TABLE identite_personne(
//     nom VARCHAR(50) NOT NULL,
//     mail VARCHAR(50) NOT NULL,
//     otp VARCHAR(50) NOT NULL
// );

// INSERT INTO identite_personne values ('un_utilisateur', 'son_mail', '111') ;
// INSERT INTO identite_personne values('marine', 'marinelangrez@outlook.fr', '111'); 

