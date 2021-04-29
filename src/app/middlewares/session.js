const userModel = require('../models/users')

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
    }
}