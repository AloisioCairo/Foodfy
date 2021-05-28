const express = require('express')
const routes = express.Router()
//const multer = require('./app/middlewares/multer')
const recipes = require('../app/controllers/recipes')
const chefs = require('../app/controllers/chefs')
const ProfileController = require('../app/controllers/ProfileController')
const routeUsers = require('./users')
const routeChefs = require('./chefs')
const routeRecipes = require('./recipes')
const routeSession = require('./session')
const session = require('../app/middlewares/session')

routes.use('/admin/users', session.logedUser, routeUsers)
routes.use('/admin/recipes', session.logedUser, routeRecipes)
routes.use('/admin/chefs', session.logedUser, routeChefs)
routes.use('/', routeSession)


routes.get("/", function (req, res) {
    return res.redirect("/courses")
})
routes.get("/courses", recipes.maisAcessadas)
routes.get("/chefes", chefs.listaChefes)

routes.get("/recipes", function (req, res) {
    return res.redirect("/courses/list")
})

routes.get("/recipes_busca", recipes.findByReceitas)

routes.get("/about", function (req, res) {
    return res.render("about/index.njk")
})

routes.get("/admin/caduso", function (req, res) {
    return res.render("./admin/cad_uso.njk")
})

//routes.get("/courses/list", recipes.lista);
routes.get("/courses/list", recipes.findByReceitas);
routes.get('/courses/:id', recipes.exibe);

// Rotas de perfil de um usuário logado
routes.get('/admin/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/admin/profile', ProfileController.put)// Editar o usuário logado

module.exports = routes