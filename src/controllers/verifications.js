const generateOTP = require('otp-generator');
const { sendMail } = require('./sendEmail');
const { validationResult } = require('express-validator');
const pg = require('pg');
const bcrypt = require('bcrypt')

const pool = new pg.Pool({
    user: 'marine',
    host: '172.31.62.53',
    database: 'formulaire',
    password: 'marine1107',
    port: 5432
});



const verificationIdentite = async (req, res) => {
    const errors = validationResult(req)
    var passage_prochaine_page = false

    if (!errors.isEmpty()) {
        res.render("authform.pug", { title: "Formulaire de connexion" });
        return;
    }

    // console.log(req.body)
    const email = req.body.mail
    const password = req.body.password
    const OTP = generateOTP.generate(6)

    let query = {
        text: 'SELECT mail from identite_personne WHERE mail=$1',
        values: [email]
    };

    const result = await pool.query(query);

    if (result.rows.length === 0) {
        const salt = await bcrypt.genSalt(10);

        hashedpassword = await bcrypt.hash(password, salt);

        // console.log(salt)
        // console.log(hashedpassword)

        query_new_user = {
            text: 'INSERT INTO identite_personne VALUES($1, $2, $3);',
            values: [email, hashedpassword, OTP]
        }
        pool.query(query_new_user);
        passage_prochaine_page = true;
    } else {

        const query_passwrd = {
            text: 'SELECT * FROM identite_personne WHERE mail = $1',
            values: [email]
        };

        pool.query(query_passwrd, async (err, result) => {
            if (err) {
                console.error(err);
                res.send({
                    "code": 400,
                    "failed": "error ocurred",
                    "message": err
                })
            } else {

                let pwrd_bdd = result.rows[0].password


                const validPassword = await bcrypt.compare(password, pwrd_bdd);
                console.log('valide', validPassword)

                if (validPassword) {
                    query_update = {
                        text: 'UPDATE identite_personne SET otp = $1 WHERE mail = $2;',
                        values: [OTP, email]
                    };
                    pool.query(query_update);
                    passage_prochaine_page = true;
                    res.redirect('/validation')



                }
                else {
                    console.log('ici')
                    res.redirect('/')


                }

            }
        });
    }
    const t = sendMail({ 'mail': email, 'otp': OTP });



}
module.exports = verificationIdentite




// CREATE TABLE identite_personne(mail VARCHAR(50) NOT NULL,password text NOT NULL,otp VARCHAR(6) NOT NULL);

// INSERT INTO identite_personne values ('un_utilisateur', 'son_mail', '111') ;
// INSERT INTO identite_personne values( 'marinelangrez@outlook.fr', '$2b$10$.udgYj9rG5joUYS3u7G5.uXLQWRJO/Pzs.HPRG9YsS4HaVpTPTWx2','111');
// INSERT INTO identite_personne values('oui', '$2b$10$.udgYj9rG5joUYS3u7G5.uXLQWRJO/Pzs.HPRG9YsS4HaVpTPTWx2', '5');

// INSERT INTO identite_personne values('test', '$2b$10$.udgYj9rG5joUYS3u7G5.uXLQWRJO/Pzs.HPRG9YsS4HaVpTPTWx2', '5');

// INSERT INTO identite_personne values('test2', '$2b$10$.udgYj9rG5joUYS3u7G5.uXLQWRJO/Pzs.HPRG9YsS4HaVpTPTWx2', '5');

// INSERT INTO identite_personne values('teest', '$2b$10$.udgYj9rG5joUYS3u7G5.uXLQWRJO/Pzs.HPRG9YsS4HaVpTPTWx2', '5'); 