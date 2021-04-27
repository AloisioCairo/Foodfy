const express = require('express')
const routes = express.Router()
//const multer = require('./app/middlewares/multer')
const recipes = require('../app/controllers/recipes')
const chefs = require('../app/controllers/chefs')
const routeUsers = require('./users')
const routeChefs = require('./chefs')
const routeRecipes = require('./recipes')


routes.use('/admin/users', routeUsers)
routes.use('/admin/recipes', routeRecipes)
routes.use('/admin/chefs', routeChefs)

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



routes.get("/admin", function (req, res) {
    return res.render("./admin/session/login.njk")
})
routes.get('/forgot-password', function (req, res) {
    return res.render("./admin/session/forgot-password.njk")
})
routes.get('/password-reset', function (req, res) {
    return res.render("./admin/session/password-reset.njk")
})
// routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
// routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

module.exports = routes