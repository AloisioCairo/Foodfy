const { age, date, format } = require('../../lib/utils')
const Chefs = require('../models/chefs')

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
    post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor. Preencha todos os campos.')
            }
        }

        Chefs.create(req.body, function (chefs) {
            return res.redirect(`./chefs/${chefs.id}`)
        })
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
    show(req, res) {
        Chefs.find(req.params.id, function (chef) {

            if (!chef)
                return res.send('Chefe não localizado.')

            //return res.render("./admin/chefs/show.njk", { chef }) 

            Chefs.recipesChef(req.params.id, function (recipesChef) {
                return res.render("./admin/chefs/show.njk", { chef, recipesChef })
            })
        })
    },
    edit(req, res) {
        Chefs.find(req.params.id, function (chef) {

            if (!chef)
                return res.send('Chefe não localizado.')

            return res.render("./admin/chefs/edit.njk", { chef })
        })
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