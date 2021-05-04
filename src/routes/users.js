const express = require('express')
const routes = express.Router()
const UserController = require('../app/controllers/UserController')
const session = require('../app/middlewares/session')

// // Rotas de perfil de um usuário logado
// routes.get('/admin/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
// routes.put('/admin/profile', ProfileController.put)// Editar o usuário logado

// // Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/', session.userLevel, UserController.list) // Mostrar a lista de usuários cadastrados
routes.post('/', UserController.post) // Cadastrar um usuário
routes.get('/create', session.userIsAdmin, UserController.create) // Mostrar o formulário de criação de um usuário
routes.put('/', UserController.put) // Editar um usuário
routes.get('/:id/edit', UserController.edit) // Mostrar o formulário de edição de um usuário
routes.delete('/:id', session.userIsAdmin, UserController.delete) // Deletar um usuário


module.exports = routes