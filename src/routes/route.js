const verificationIdentite = require("../controllers/verifications")

const route= require("express").Router()

route.get('/', (req, res) => {
    res.render('authform.pug', {title: "Formulaire de connexion"})
})

route.post('/', verificationIdentite)

module.exports=route