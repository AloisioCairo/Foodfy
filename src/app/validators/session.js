const { compare } = require('bcryptjs')
const UserModel = require('../models/users')
// const user = require('../views/admin/session/login')

module.exports = {
    async login(req, res, next) {
        const { email, password } = req.body

        const user = await UserModel.findOne({ where: { email } })

        if (!user) return res.render("../views/admin/session/login", {
            user: req.body,
            error: "Usuário não localizado!"
        })

        // Descriptografa a senha
        const passed = await compare(password, user.password)

        if (!passed) return res.render("../views/admin/session/login", {
            user: req.body,
            error: "Senha inválida!"
        })

        req.user = user
        req.session.user = user // Cria a sessão do usuário

        next()
    }
}