const { age, date, format } = require('../../lib/utils')
const recipes = require('../models/recipes')
const Recipes = require('../models/recipes')

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
    post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor. Preencha todos os campos.')
            }
        }

        Recipes.create(req.body, function (recipes) {
            return res.redirect(`./recipes/${recipes.id}`)
        })
    },
    index(req, res) {
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

                console.log('recipes[0].total_' + recipes[0].total)
                console.log('limit_' + limit)
                console.log('Math.ceil(recipes[0].total / limit)_' + Math.ceil(recipes[0].total / limit))

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
    show(req, res) {
        Recipes.find(req.params.id, function (recipe) {

            if (!recipe)
                return res.send('Receita não localizada.')

            return res.render("./admin/recipes/show.njk", { recipe })
        })
    },
    exibe(req, res) {
        Recipes.find(req.params.id, function (recipe) {

            if (!recipe)
                return res.send('Receita não localizada.')

            return res.render("courses/show", { recipe })
        })
    },
    edit(req, res) {
        Recipes.find(req.params.id, function (recipe) {

            if (!recipe)
                return res.send('Receita não localizada.')

            //return res.render("./admin/recipes/edit.njk", { recipe })

            Recipes.chefSelectOptions(function (options) {
                return res.render("./admin/recipes/edit.njk", { recipe, chefOptions: options })
            })
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor. Preencha todos os campos.')
            }
        }

        console.log(req.body);

        Recipes.update(req.body, function () {
            return res.redirect(`./recipes/${req.body.id}`)
        })
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