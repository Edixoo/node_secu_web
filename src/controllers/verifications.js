const generateOTP = require('otp-generator');
const { sendMail } = require('./sendEmail');



const verificationIdentite= (req, res) => {
        const errors= validationResult(req)

        if(!errors.isEmpty()) {
            res.render("authform.pug", { titlm: "Formulaire de connexion"});
            return;
        }

        const email=req.body.mail
        const password=req.body.password

        const OTP = generateOTP.generate(6)
        const t=sendMail({'mail': email, 'otp': OTP});
    }

module.exports=verificationIdentite