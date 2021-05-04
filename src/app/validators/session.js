const { compare } = require('bcryptjs')
const userModel = require('../models/users')
// const user = require('../views/admin/session/login')

module.exports = {
    async login(req, res, next) {
        const { email, password } = req.body

        const user = await userModel.findOne({ where: { email } })

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
        // req.session.user = user // Cria a sessão do usuário

        next()
    },
    // Verifica se o e-mail informado está cadastro do banco
    async forgot(req, res, next) {
        const { email } = req.body

        try {
            let user = await userModel.findOne({ where: { email } })

            if (!user) return res.render("../views/admin/session/forgot-password", {
                user: req.body,
                alert: "E-mail não cadastrado."
            })

            req.user = user

            next()
        } catch (err) {
            console.error('Erro ao verificar se o e-mail informado está cadastrado no sistema. Erro: ' + err)
        }
    },
    async reset(req, res, next) {
        const { email, password, passwordRepeat, token } = req.body

        const user = await userModel.findOne({ where: { email } })

        if (!user) return res.render("../views/admin/session/password-reset", {
            token,
            alert: "Usuário não cadastrado!"
        })

        // Verifica se as senhas informadas são iguais
        if (password != passwordRepeat) return res.render('../views/admin/session/password-reset', {
            user: req.body,
            token,
            alert: 'As senhas informadas estão diferentes.'
        })

        // Verifica se o token existe
        if (token != user.reset_token) return res.render('../views/admin/session/password-reset', {
            user: req.body,
            token,
            alert: 'Token inválido. Solicite uma nova recuperação de senha.'
        })

        // Verifica se o token não expirou
        let now = new Date()
        now = now.setHours(now.getHours())

        if (now > user.reset_token_expires) return res.render('../views/admin/session/password-reset', {
            user: req.body,
            token,
            alert: 'Token expirado. Por favor, solicite uma nova recuperação de senha.'
        })

        req.user = user

        next()
    }
}