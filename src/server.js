const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')
const session = require('./config/session')

const server = express()

server.use(express.urlencoded({ extended: true }))

server.use(session) // Controle da sessão do usuário

// Cria uma variável global para identificar quando o usuário está logado
server.use((req, res, next) => {
    res.locals.session = req.session
    next()
})

server.use(express.static('public'))
server.use(methodOverride('_method'))
server.use(routes)

server.set("view engine", "njk")
nunjucks.configure("src/app/views", {
    express: server,
    autoescape: false,
    noCache: true
})

server.use(function (req, res) {
    res.status(404).render("not-found");
});

server.listen(5000, function () {
    console.log("Server is running")
})