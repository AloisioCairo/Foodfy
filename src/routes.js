const express = require('express')
const routes = express.Router()
const recipes =  require('./app/controllers/recipes')

routes.get("/", function(req, res){
    return res.redirect("/courses")
})
routes.get("/courses", recipes.maisAcessadas)

routes.get("/recipes", function(req, res){        
    return res.redirect("/courses/list")
    
    /*return res.render("recipes/index.njk")*/
})

routes.get("/about", function(req, res){        
    return res.render("about/index.njk")
})

routes.get("/courses/list", recipes.lista);
routes.get('/courses/:id', recipes.exibe);

routes.get("/admin/recipes", recipes.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", recipes.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", recipes.show); // Exibir detalhes de uma receita
routes.post("/admin/recipes", recipes.post); // Cadastrar nova receita
routes.get("/admin/recipes/:id/edit", recipes.edit); // Mostrar formulário de edição de receita

/*
routes.put("/admin/recipes", recipes.put); // Editar uma receita
routes.delete("/admin/recipes", recipes.delete); // Deletar uma receita
*/

module.exports = routes