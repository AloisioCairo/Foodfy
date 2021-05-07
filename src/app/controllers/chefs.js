const { age, date, format } = require('../../lib/utils')
const Chefs = require('../models/chefs')
const File = require('../models/file')
const Recipes = require('../models/recipes')

module.exports = {
    lista(req, res) {
        Chefs.all(function (chefs) {
            return res.render("courses/index.njk", { chefs })
        })
    },
    async listaChefes(req, res) {
        let results = await Chefs.listAll()
        const chefs = results.rows

        // Retorna a imagem do chefe
        async function getImage(chefId) {
            let results = await Chefs.file(chefId)
            const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        // Essa const retorna um array
        const chefsPromise = chefs.map(async chef => {
            chef.img = await getImage(chef.id)
            chef.name = chef.name

            return chef
        })

        const chefAdded = await Promise.all(chefsPromise)

        return res.render("chefs.njk", { chefs: chefAdded })
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
    async index(req, res) {
        const { filter } = req.query

        if (filter) {
            let results = await Chefs.all(filter)
            const chefs = results.rows

            // Retorna a imagem do chefe
            async function getImage(chefId) {
                let results = await Chefs.file(chefId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

                return files[0]
            }

            // Essa const retorna um array
            const chefsPromise = chefs.map(async chef => {
                chef.img = await getImage(chef.id)
                chef.name = chef.name

                return chef
            })

            const lastAdded = await Promise.all(chefsPromise)

            return res.render("./admin/chefs/index.njk", { filter, chefs: lastAdded })

        } else {
            let results = await Chefs.all('')
            const chefs = results.rows

            // Retorna a imagem do chefe
            async function getImage(chefId) {
                let results = await Chefs.file(chefId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

                return files[0]
            }

            // Essa const retorna um array
            const chefsPromise = chefs.map(async chef => {
                chef.img = await getImage(chef.id)
                chef.name = chef.name

                return chef
            })

            const lastAdded = await Promise.all(chefsPromise)

            return res.render("./admin/chefs/index.njk", { filter, chefs: lastAdded })
        }
    },
    async show(req, res) {
        let results = await Chefs.find(req.params.id)
        const chef = results.rows[0]

        if (!chef)
            return res.send('Chefe não localizado.')

        // Seleciona a foto
        results = await Chefs.file(chef.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))





        // - - - - - - Funções para buscar os dados das receitas do chefe - - - - - -
        // Seleciona as receitas
        results = await Chefs.recipesChef(chef.id)
        const resultsRecipesChef = results.rows

        // Retorna a imagem principal da receita
        async function getImage(recipeId) {
            let results = await Recipes.findOneImageRecipe(recipeId)
            const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        // Essa const retorna um array com as receitas do chefe
        const recipesPromise = resultsRecipesChef.map(async recipesChef => {
            recipesChef.img = await getImage(recipesChef.id)
            recipesChef.name = recipesChef.name

            return recipesChef
        })

        const recipesAdded = await Promise.all(recipesPromise)

        return res.render("./admin/chefs/show.njk", { chef, recipesChef: recipesAdded, files })
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

            if (recipe == null) {
                return res.redirect(`/admin/chefs`)
            }
            else {
                return res.redirect(`./caduso`)
            }
        })
    }
}