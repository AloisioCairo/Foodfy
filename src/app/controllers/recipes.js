const { age, date, format } = require('../../lib/utils')
const recipes = require('../models/recipes')
const Recipes = require('../models/recipes')
const File = require('../models/file')
const file = require('../models/file')

module.exports = {
    maisAcessadas(req, res) {
        Recipes.maisAcessadas(function (recipes) {
            return res.render(`courses.njk`, { recipes })
        })
    },
    lista(req, res) {
        Recipes.all(function (recipes) {
            return res.render("courses/index.njk", { recipes })
        })
    },
    create(req, res) {
        //return res.render("./admin/recipes/create.njk")

        Recipes.chefSelectOptions(function (options) {
            return res.render("./admin/recipes/create.njk", { chefOptions: options })
        })
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor. Preencha todos os campos.')
            }
        }

        if (req.files.length == 0)
            return res.send('Por favor, informe ao menos uma imagem.')

        let results = await Recipes.create(req.body)
        const recipeId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create({ ...file, recipe_id: recipeId }))
        await Promise.all(filesPromise) // Espera que o arquivo com a imagem seja criado antes de prosseguir

        return res.redirect(`./recipes/${recipeId}`)
    },
    async index(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(recipes) {
                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }

                //return res.render(`recipes_filter.njk`, { recipes, pagination, filter })
                return res.render("./admin/recipes/index.njk", { recipes, pagination, filter })
            }
        }

        Recipes.paginateAdm(params)

        /*
        const { filter } = req.query
        console.log('1')
        if (filter) { // O usuário filtrou pelo nome da receita ou do chefe
            Recipes.all(filter, function (recipes) {
                return res.render("./admin/recipes/index.njk", { recipes, filter })
            })
        } else {
            console.log('2')
            Recipes.all('', function (recipes) {
                return res.render("./admin/recipes/index.njk", { recipes, filter })
            })
        }*/
    },
    async show(req, res) {
        let results = await Recipes.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe)
            return res.send('Receita não localizada.')

        // Busca a 1º imagem selecionado no cadastro da receita
        results = await Recipes.findOneImageRecipe(recipe.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("./admin/recipes/show.njk", { recipe, files })
    },
    exibe(req, res) {
        Recipes.find(req.params.id, function (recipe) {

            if (!recipe)
                return res.send('Receita não localizada.')

            return res.render("courses/show", { recipe })
        })
    },
    async edit(req, res) {
        let results = await Recipes.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe)
            return res.send('Receita não localizada.')

        results = await Recipes.chefSelectOptions()
        let chefOptions = results.rows

        // Busca as imagens da receita
        results = await Recipes.files(recipe.id)
        let files = results.rows

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("./admin/recipes/edit.njk", { recipe, chefOptions, files })
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send('Por favor. Preencha todos os campos.')
            }
        }

        // Regra para atualização das imagens da receita
        if (req.files.length != 0) {
            const newFilesPromisse = req.files.map(file =>
                File.create({ ...file, recipe_id: req.body.id }))

            await Promise.all(newFilesPromisse)
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",") // [1, 2, 3,]
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1) // Remove a última posição "," (virgula) ficando [1, 2, 3]

            const removedFilesPromise = removedFiles.map(id => File.delete(id))

            await Promise.all(removedFilesPromise)
        }

        await Recipes.update(req.body)

        return res.redirect(`./recipes/${req.body.id}`)
    },
    delete(req, res) {
        Recipes.delete(req.body.id, function () {
            return res.redirect(`./recipes/`)
        })
    },
    findByReceitas(req, res) {

        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(recipes) {
                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }

                return res.render(`recipes_filter.njk`, { recipes, pagination, filter })
            }
        }

        Recipes.paginate(params)

        /*const { filter } = req.query

        if (filter) { // Se o usuário informar o nome da receita
            Recipes.findByReceitas(filter, function (recipes) {
                return res.render(`recipes_filter.njk`, { recipes, filter })
            })
        } else {
            Recipes.maisAcessadas(function (recipes) {
                return res.render(`courses.njk`, { recipes })
            })
        }*/
    }
}