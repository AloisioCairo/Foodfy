const { unlinkSync } = require('fs')

const { age, date, format } = require('../../lib/utils')
const Chefs = require('../models/chefs')
const File = require('../models/file')
const Recipes = require('../models/recipes')

module.exports = {
    lista(res) {
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
        try {
            return res.render("./admin/chefs/create.njk")
        } catch (error) {
            console.error('Ocorreu um erro ao tentar criar um novo cadastro de chefe. Erro: ' + error)
        }
    },
    async post(req, res) {
        try {
            let { name } = req.body

            // Salva a foto do chefe
            const fileId = await Promise.all(req.files.map(file => File.create({
                ...file,
                recipe_id: 0
            })))

            const chef_id = await Chefs.create({
                name,
                created_at: date(Date.now()).iso,
                file_id: fileId[0].rows[0].id
            })

            return res.redirect(`./chefs/${chef_id}`)
        } catch (error) {
            console.error('Ocorreu um erro ao tentar salvar um novo cadastro de chefe. Erro: ' + error)
        }
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
        // results = await Chefs.find(chef.id)
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
    async put(req, res) {
        try {
            await Chefs.update(req.body.id, {
                name: req.body.name
            })

            return res.redirect(`./chefs/${req.body.id}`)
        } catch (error) {
            console.error('Ocorreu um erro ao tentar salvar as alterações no cadastro de chefe. Erro: ' + error)
        }
    },
    async delete(req, res) {
        try {
            const recipes = await Chefs.recipesChef(req.body.id)

            if (recipes == null) {
                const results = await Chefs.file(req.body.id)
                const file = results.rows[0]

                if (file != null)
                    unlinkSync(file.path)

                Chefs.delete(req.body.id)

                return res.redirect(`/admin/chefs`)
            }
            else {
                return res.redirect(`./caduso`)
            }




            // const results = await Chefs.recipesChef(req.body.id)
            // const recipes = results.rows[0]

            // if (recipes == null) {
            //     const results = await Chefs.file(req.body.id)
            //     const file = results.rows[0]

            //     if (file != null)
            //         unlinkSync(file.path)

            //     Chefs.delete(req.body.id)

            //     return res.redirect(`/admin/chefs`)
            // }
            // else {
            //     return res.redirect(`./caduso`)
            // }
        } catch (error) {
            console.error('Ocorreu um erro ao tentar excluir o cadastro de chefe. Erro: ' + error)
        }
    }
}