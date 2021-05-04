const express = require('express')
const routes = express.Router()
const recipes = require('../app/controllers/recipes')
const multer = require('../app/middlewares/multer')
const session = require('../app/middlewares/session')

routes.get("/", recipes.index); // Mostrar a lista de receitas
routes.get("/create", session.userIsAdmin, recipes.create); // Mostrar formulário de nova receita
routes.get("/:id", recipes.show); // Exibir detalhes de uma receita
routes.post("/", multer.array("photos", 5), recipes.post); // Cadastrar nova receita
routes.get("/:id/edit", session.recipeUser, recipes.edit); // Mostrar formulário de edição de receita
routes.put("/", multer.array("photos", 5), recipes.put); // Editar uma receita
routes.delete("/", session.recipeUser, recipes.delete); // Deletar uma receita


module.exports = routes