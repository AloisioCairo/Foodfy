const { age, date, format } = require('../../lib/utils')
const Recipes = require('../models/recipes')
const File = require('../models/file')

module.exports = {
    async maisAcessadas(req, res) {

        let results = await Recipes.maisAcessadas()
        const recipes = results.rows

        // Retorna a imagem principal da receita
        async function getImage(recipeId) {
            let results = await Recipes.findOneImageRecipe(recipeId)
            const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        // Essa const retorna um array com as receitas do chefe
        const recipesPromise = recipes.map(async recipe => {
            recipe.img = await getImage(recipe.id)
            recipe.name = recipe.name

            return recipe
        })

        const recipesAdded = await Promise.all(recipesPromise)

        return res.render(`courses.njk`, { recipes: recipesAdded })
    },
    lista(req, res) {
        Recipes.all(function (recipes) {
            return res.render("courses/index.njk", { recipes })
        })
    },
    async create(req, res) {
        let results = await Recipes.chefSelectOptions()
        const chefOptions = results.rows

        return res.render("./admin/recipes/create.njk", { chefOptions })
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

        req.body.user_id = req.session.user.id

        console.log('req.session.user.id__' + req.session.user.id)

        let results = await Recipes.create(req.body)
        const recipeId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create({ ...file, recipe_id: recipeId }))
        await Promise.all(filesPromise) // Espera que o arquivo com a imagem seja criado antes de prosseguir

        return res.redirect(`./recipes/${recipeId}`)
    },
    async index(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset
        }

        let results = await Recipes.paginateAdm(params)
        const recipes = results.rows

        const pagination = { // recipes.total
            total: Math.ceil(recipes[0].total / limit),
            page
        }

        // Retorna a imagem principal da receita
        async function getImage(recipeId) {
            let results = await Recipes.findOneImageRecipe(recipeId)
            const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        // Essa const retorna um array com os dados das receitas
        const recipesPromise = recipes.map(async recipe => {
            recipe.img = await getImage(recipe.id)
            recipe.name = recipe.name

            return recipe
        })

        const recipesAdded = await Promise.all(recipesPromise)

        return res.render("./admin/recipes/index.njk", { recipes: recipesAdded, pagination, filter })
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

        // Busca todas as imagens do cadastro da receita
        results = await Recipes.files(recipe.id)
        const allFiles = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("./admin/recipes/show.njk", { recipe, files, allFiles })
    },
    async exibe(req, res) {
        let results = await Recipes.find(req.params.id)
        const recipe = results.rows[0]

        // Busca todas as imagens do cadastro da receita
        results = await Recipes.findOneImageRecipe(recipe.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("courses/show", { recipe, files })



        /*Recipes.find(req.params.id, function (recipe) {
 
            if (!recipe)
                return res.send('Receita não localizada.')
 
            return res.render("courses/show", { recipe })
        })*/
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
    async delete(req, res) {
        await Recipes.delete(req.body.id)

        return res.redirect(`./recipes/`)
    },
    async findByReceitas(req, res) {

        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset
        }

        let results = await Recipes.paginate(params)
        const recipes = results.rows

        const pagination = {
            total: Math.ceil(recipes[0].total / limit),
            page
        }

        // Retorna a imagem principal da receita
        async function getImage(recipeId) {
            let results = await Recipes.findOneImageRecipe(recipeId)
            const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        // Essa const retorna um array com os dados das receitas
        const recipesPromise = recipes.map(async recipe => {
            recipe.img = await getImage(recipe.id)
            recipe.name = recipe.name

            return recipe
        })

        const recipesAdded = await Promise.all(recipesPromise)

        return res.render(`recipes_filter.njk`, { recipes: recipesAdded, pagination, filter })

    }
}