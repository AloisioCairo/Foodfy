const express = require('express')
const routes = express.Router()
const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')

routes.get("/", function (req, res) {
    return res.redirect("/courses")
})
routes.get("/courses", recipes.maisAcessadas)
routes.get("/chefes", chefs.listaChefes)

routes.get("/recipes", function (req, res) {

    //console.log(req.query)

    return res.redirect("/courses/list")

    //return res.render("recipes/index.njk")
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

routes.get("/admin/recipes", recipes.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", recipes.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", recipes.show); // Exibir detalhes de uma receita
routes.post("/admin/recipes", recipes.post); // Cadastrar nova receita
routes.get("/admin/recipes/:id/edit", recipes.edit); // Mostrar formulário de edição de receita
routes.put("/admin/recipes", recipes.put); // Editar uma receita
routes.delete("/admin/recipes", recipes.delete); // Deletar uma receita

routes.get("/admin/chefs", chefs.index); // Mostrar a lista de chefes
routes.get("/admin/chefs/create", chefs.create); // Mostrar formulário de nova chefe
routes.get("/admin/chefs/:id", chefs.show); // Exibir detalhes de uma chefe
routes.post("/admin/chefs", chefs.post); // Cadastrar nova chefe
routes.get("/admin/chefs/:id/edit", chefs.edit); // Mostrar formulário de edição de chefe
routes.put("/admin/chefs", chefs.put); // Editar uma chefe
routes.delete("/admin/chefs", chefs.delete); // Deletar uma chefe

module.exports = routes