const express = require('express')
const routes = express.Router()
const chefs = require('../app/controllers/chefs')
const multer = require('../app/middlewares/multer')
const session = require('../app/middlewares/session')

routes.get("/", chefs.index); // Mostrar a lista de chefes
routes.get("/create", session.userIsAdmin, chefs.create); // Mostrar formulário de nova chefe
routes.get("/:id", chefs.show); // Exibir detalhes de um chefe
routes.post("/", multer.array("photo", 1), chefs.post); // Cadastrar novo chefe
routes.get("/:id/edit", session.userIsAdmin, chefs.edit); // Mostrar formulário de edição de chefe
routes.put("/", multer.array("photo", 1), chefs.put); // Editar um chefe
routes.delete("/chefs", session.userIsAdmin, chefs.delete); // Deletar um chefe

module.exports = routes