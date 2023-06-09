const verificationIdentite = require("../controllers/verifications")
const route = require("express").Router()
const validationIdentite = require("../controllers/validation")
const modificationIdentite = require("../controllers/modification")




route.get('/', (req, res) => {
    res.render('authform.pug', { title: "Formulaire de connexion" })
})

route.post('/', verificationIdentite)



route.post('/validation', validationIdentite)
route.get('/validation', (req, res) => {
    res.render('verificationOTP.pug', { title: "Vérification de l'OTP" })
})

route.get('/connexion_etabli', (req, res) => {
    res.render('connexion.pug', { title: "Connexion Etablie" })
})

route.get('/modification', (req, res) => {
    res.render('modifier.pug', { title: "Modifications" })
})

route.post('/modification', modificationIdentite)





module.exports = { route }


