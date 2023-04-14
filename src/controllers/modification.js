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



const modificationIdentite = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.render("authform.pug", { title: "Formulaire de connexion" });
        return;
    }

    // console.log(req.body)
    const email = req.body.mail
    const ancien_password = req.body.ancienpassword
    const newpassword = req.body.newpassword

    //Vérification si l'ancien mot de passe que dit être l'utilisateur est l'ancien mot de passe de la base de données

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

            let ancien_pwrd_bdd = result.rows[0].password
            const validPassword = await bcrypt.compare(ancien_password, ancien_pwrd_bdd);

            if (validPassword) {
                const salt = await bcrypt.genSalt(10);
                let hashedpassword = await bcrypt.hash(newpassword, salt);


                const query_update = {
                    text: 'UPDATE identite_personne SET password = $1 WHERE mail = $2;',
                    values: [hashedpassword, email]
                };

                pool.query(query_update);


            } {
                res.redirect('/')
            }


        }
    })
    res.redirect('/connexion_etabli')
}
module.exports = modificationIdentite


