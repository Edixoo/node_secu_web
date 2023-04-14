const generateOTP = require('otp-generator');
const { sendMail } = require('./sendEmail');
const { validationResult } = require('express-validator');
const pg = require('pg');


const pool = new pg.Pool({
    user: 'paul',
    host: 'localhost',
    database: 'formulaire',
    password: 'Paul2003**',
    port: 5432
});



const validationIdentite = (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.render("verificationOTP.pug", { title: "OTP" });
        return;
    }

    const otp_utilisateur = req.body.otp_number
    const email_utilisateur = req.body.mail

    const query = {
        text: 'SELECT * FROM identite_personne WHERE mail = $1 AND otp = $2',
        values: [email_utilisateur, otp_utilisateur]
    };

    console.log(email_utilisateur)
    console.log(otp_utilisateur)


    pool.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.send({
                "code": 400,
                "failed": "error ocurred",
                "message": err
            })
        } else {
            console.log(result)
            let otp_bdd = result.rows[0].otp
            if (otp_bdd != otp_utilisateur) {
                res.redirect('/')
            }
            else {
                res.redirect('/connexion_etabli')
            }

        }
    });



}

module.exports = validationIdentite