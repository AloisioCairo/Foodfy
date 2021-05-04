const userModel = require('../models/users')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const { hash } = require('bcryptjs') // Biblioteca para fazer o hash da senha

module.exports = {
    loginForm(req, res) {
        return res.render("./admin/session/login")
    },
    login(req, res) {
        req.session.user = req.user // Cria a sessão do usuário
        req.session.userId = req.user.id

        return res.redirect("/admin/recipes")
    },
    forgotForm(req, res) {
        return res.render("./admin/session/forgot-password")
    },
    async forgot(req, res) {
        try {
            const user = req.user
            const token = crypto.randomBytes(20).toString("hex")

            // Expiração do token
            let now = new Date()
            now = now.setHours(now.getHours + 1) // Validade do token de 1 hora

            await userModel.updateField(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            // Envia o e-mail com um link de recuperação de senha
            await mailer.sendMail({
                to: user.email,
                from: 'aloisiocairo@gmail.com',
                subject: 'Recuperação de senha',
                html: `<h2>Perdeu a chave?</h2>
                <p>Não se preoucupe. Clique no link abaixo para recuperar sua senha</p>
                <p>
                    <a href="http://localhost:3000/password-reset?token=${token}" target="_blank">
                        RECUPERAR SENHA
                    </a>
                </p>
            `,
            })

            // Avisa o usuário que enviou o e-mail
            return res.render("../views/admin/session/forgot-password", {
                success: "Verifique seu e-mail para resetar sua senha!"
            })

        } catch (err) {
            console.error('Erro ao tentar recuperar senha. Error: ' + err)

            return res.render("../app/views/admin/session/forgot-password", {
                error: "Erro ao tentar recuperar a senha. Favor tentar novamente."
            })
        }
    },
    resetForm(req, res) {
        return res.render("./admin/session/password-reset", { token: req.query.token })
    },
    async reset(req, res) {
        try {
            const user = req.user
            const { password, token } = req.body

            const newPassword = await hash(password, 8) // 8 é a força do hash da senha

            await userModel.updateField(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: "",
            })

            // return res.render("./admin/session/login")

            return res.render("../views/admin/session/login", {
                user: req.body,
                success: "Senha atualizada. Faça o seu login."
            })
        } catch (err) {
            console.error('Erro ao tentar resetar a senha. Error: ' + err)

            return res.render("./admin/session/password-reset", {
                user: req.body,
                token,
                error: "Erro ao tentar resetar a senha. Favor tentar novamente."
            })
        }
    },
    logout(req, res) {
        req.session.destroy()
        res.redirect('/admin')
    }
}