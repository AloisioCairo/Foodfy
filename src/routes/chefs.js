const express = require('express')
const routes = express.Router()
const chefs = require('../app/controllers/chefs')
const multer = require('../app/middlewares/multer')

routes.get("/", chefs.index); // Mostrar a lista de chefes
routes.get("/create", chefs.create); // Mostrar formulário de nova chefe
routes.get("/:id", chefs.show); // Exibir detalhes de um chefe
routes.post("/", multer.array("photo", 1), chefs.post); // Cadastrar nova chefe
routes.get("/:id/edit", chefs.edit); // Mostrar formulário de edição de chefe
routes.put("/", multer.array("photo", 1), chefs.put); // Editar um chefe
routes.delete("/chefs", chefs.delete); // Deletar um chefe

module.exports = routes