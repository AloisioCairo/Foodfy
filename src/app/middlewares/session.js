const userModel = require('../models/users')
const recipeModel = require('../models/recipes')

module.exports = {
    // Verifica se o usuário está logado
    logedUser(req, res, next) {
        if (!req.session.user)
            return res.redirect('/admin')

        next()
    },
    // Verificar se o usuário é ADMINISTRADOR
    async userIsAdmin(req, res, next) {
        let result = await userModel.isAdmin(req.session.user.id)
        const userAdmin = result.rows[0].is_admin

        if (!userAdmin) {
            return res.redirect('./')
        }

        next()
    },
    // Validar qual usuário cadastrou a receita
    async recipeUserEdit(req, res, next) {
        let result = await recipeModel.userRecipe(req.params.id)
        const user = result.rows[0]

        result = await userModel.isAdmin(req.session.user.id)
        const userAdmin = result.rows[0].is_admin

        const userId = user.user_id

        if ((userId != req.session.user.id) && (!userAdmin)) {
            return res.redirect('./')
        }

        next()
    },
    // Validar qual usuário cadastrou a receita
    async recipeUser(req, res, next) {
        let result = await recipeModel.userRecipe(req.body.id)
        const user = result.rows[0]

        result = await userModel.isAdmin(req.session.user.id)
        const userAdmin = result.rows[0].is_admin

        const userId = user.user_id

        if ((userId != req.session.user.id) && (!userAdmin)) {
            return res.redirect('./')
        }

        next()
    },
    // Verificar se o usuário é ADMINISTRADOR
    async userLevel(req, res, next) {
        let result = await userModel.isAdmin(req.session.user.id)
        const userAdmin = result.rows[0].is_admin

        if (!userAdmin)
            return res.redirect(`/admin/users/${req.session.user.id}/edit`)

        next()
    },
}