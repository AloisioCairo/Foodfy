const UserModel = require('../models/users')
const { put } = require('./recipes')

module.exports = {
    async list(req, res) {
        let users = await UserModel.all()
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

        const userId = await UserModel.create(req.body)

        return res.redirect(`./users/${userId.rows[0].id}/edit`)
    },
    async edit(req, res) {
        let result = await UserModel.find(req.params.id)
        const user = result.rows[0]

        return res.render("./admin/users/edit.njk", { user })
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send('Por favor. Preencha todos os campos.')
            }
        }

        await UserModel.update(req.body)
        return res.redirect('')

    }
}