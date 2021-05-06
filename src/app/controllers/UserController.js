const users = require('../models/users')
const userModel = require('../models/users')
const recipeModel = require('../models/recipes')
const { hash } = require('bcryptjs') // Biblioteca para fazer o hash da senha
const mailer = require('../../lib/mailer')
const crypto = require('crypto')

module.exports = {
    async list(req, res) {
        let users = await userModel.all()
        return res.render("./admin/users/index.njk", { users })
    },
    async create(req, res) {
        return res.render("./admin/users/create.njk")
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send('Por favor. Preencha todos os campos.')
            }
        }

        let result = await userModel.create(req.body)
        const user = result.rows[0]

        // password = `${user.id}`
        password = crypto.randomBytes(20).toString("hex")
        const passwordHash = await hash(password, 8)

        await userModel.updateField(user.id, {
            password: passwordHash
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

        return res.redirect(`./users/${user.id}/edit`)
    },
    async edit(req, res) {
        let result = await userModel.find(req.params.id)
        const user = result.rows[0]

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
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send('Por favor. Preencha todos os campos.')
            }
        }

        await userModel.update(req.body)
        return res.redirect(`/admin/users`)
    },
    async delete(req, res) {
        if (req.session.user.id == req.body.id) {
            return res.redirect('./')
        }

        let result = await users.delete(req.body.id)
        const recipe = result

        if (recipe != null) {
            return res.redirect(`/admin/caduso`)
        } else {
            return res.redirect(`/admin/users`)
        }
    }
}