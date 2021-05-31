const users = require('../models/users')
const userModel = require('../models/users')
const recipeModel = require('../models/recipes')
const { hash } = require('bcryptjs') // Biblioteca para fazer o hash da senha
const mailer = require('../../lib/mailer')
const crypto = require('crypto')
const { date } = require('../../lib/utils')

module.exports = {
    async list(req, res) {
        try {
            const users = await userModel.findAll()
            return res.render("./admin/users/index.njk", { users })
        } catch (error) {
            console.error('Erro ao tentar listar todos os usuários: Erro: ' + error)
        }
    },
    async create(req, res) {
        try {
            return res.render("./admin/users/create.njk")
        } catch (error) {
            console.error('Erro ao tentar criar um novo cadastro de usuário. Erro: ' + error)
        }
    },
    async post(req, res) {
        let { name, email, password, is_admin } = req.body

        password = crypto.randomBytes(20).toString("hex")
        const passwordHash = await hash(password, 8)

        // Cria o token para o usuário
        const token = crypto.randomBytes(20).toString("hex")

        // Cria a expiração do token
        let now = new Date()
        now = now.setHours(now.getHours + 1)

        const user = await userModel.create({
            name,
            email,
            password: passwordHash,
            reset_token: token,
            reset_token_expires: now,
            is_admin: is_admin || false,
            created_at: date(Date.now()).iso
        })

        // Envia o e-mail com um link de recuperação de senha
        await mailer.sendMail({
            to: req.session.user.email, // Email do usuário logado
            from: 'aloisiocairo@gmail.com',
            subject: 'Foodfy: Senha de acesso',
            html: `<h2>Senha de acesso ao sistema Foodfy</h2>
            <p>Senha</p>
            <h5>${password}</h5>
        `,
        })

        return res.redirect(`./users/${user}/edit`)
    },
    async edit(req, res) {
        try {
            const user = await userModel.find(req.params.id)

            // Seleciona as receitas cadastrada pelo usuário 
            result = await recipeModel.recipeUser(user.id)
            const recipesUser = result.rows

            // Retorna a imagem principal da receita
            async function getImage(recipeId) {
                let results = await recipeModel.findOneImageRecipe(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

                return files[0]
            }

            // Essa const retorna um array com os dados das receitas
            const recipesPromise = recipesUser.map(async recipe => {
                recipe.img = await getImage(recipe.id)

                return recipe
            })
            const recipesAdded = await Promise.all(recipesPromise)

            return res.render("./admin/users/edit.njk", { user, recipeUser: recipesAdded })
        } catch (error) {
            console.error('Erro ao tentar editar o cadastro do usuário. Erro: ' + error)
        }
    },
    async put(req, res) {
        let { name, email, is_admin, password } = req.body

        const passwordHash = await hash(password, 8)

        await userModel.update(req.body.id, {
            name,
            email,
            password: passwordHash,
            is_admin: is_admin || false
        })
        return res.redirect(`/admin/users`)
    },
    async delete(req, res) {
        if (req.session.user.id == req.body.id) {
            return res.redirect('./')
        }

        let result = await recipeModel.recipeUser(req.body.id)
        const recipe = result.rows[0]

        if (recipe != null) {
            return res.redirect(`/admin/caduso`)
        } else {
            await users.delete(req.body.id)
            return res.redirect(`/admin/users`)
        }
    }
}