const { age, date, format } = require('../../lib/utils')
const Chefs = require('../models/chefs')
const file = require('../models/file')
const File = require('../models/file')

module.exports = {
    lista(req, res) {
        Chefs.all(function (chefs) {
            return res.render("courses/index.njk", { chefs })
        })
    },
    listaChefes(req, res) {
        Chefs.listAll(function (chefs) {
            return res.render("chefs.njk", { chefs })
        })
    },
    create(req, res) {
        return res.render("./admin/chefs/create.njk")
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor. Preencha todos os campos.')
            }
        }

        // Salva a foto do chefe
        const fileId = await Promise.all(req.files.map(file => File.create({
            ...file, recipe_id: 0
        })))

        results = await Chefs.create(req.body, fileId[0].rows[0].id)
        const chefs = results.rows[0]

        return res.redirect(`./chefs/${chefs.id}`)
    },
    index(req, res) {
        const { filter } = req.query

        if (filter) {
            Chefs.all(filter, function (chefs) {
                return res.render("./admin/chefs/index.njk", { filter, chefs })
            })
        } else {
            Chefs.all('', function (chefs) {
                return res.render("./admin/chefs/index.njk", { filter, chefs })
            })
        }
    },
    async show(req, res) {
        let results = await Chefs.find(req.params.id)
        const chef = results.rows[0]

        if (!chef)
            return res.send('Chefe não localizado.')

        // Seleciona a foto
        results = await File.finFileChef(chef.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        // Seleciona as receitas
        results = await Chefs.recipesChef(chef.id)
        const recipesChef = results.rows

        return res.render("./admin/chefs/show.njk", { chef, recipesChef, files })
    },
    async edit(req, res) {
        let results = await Chefs.find(req.params.id)
        const chef = results.rows[0]

        if (!chef)
            return res.send('Chefe não localizado.')

        return res.render("./admin/chefs/edit.njk", { chef })
    },
    put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor. Preencha todos os campos.')
            }
        }

        Chefs.update(req.body, function () {
            return res.redirect(`./chefs/${req.body.id}`)
        })
    },
    delete(req, res) {
        Chefs.delete(req.body.id, function (recipe) {

            if (recipe == null)
                return res.redirect(`./chefs/`)
            else {
                return res.redirect(`./caduso`)
            }
        })
    }
}