const { age, date, format } = require('../../lib/utils')
const Recipes = require('../models/recipes')

module.exports = {    
    maisAcessadas(req, res){
        Recipes.maisAcessadas(function(recipes){
            return res.render(`courses.njk`, { recipes })
        })
    },
    lista(req, res){
        Recipes.all(function(recipes){
            return res.render("courses/index.njk", { recipes })
        })        
    },
    create(req, res){        
       return res.render("./admin/recipes/create.njk")
    },
    post(req, res){
        const keys = Object.keys(req.body)

        for (key of keys){
            if (req.body[key] == "") {
                return res.send('Por favor. Preencha todos os campos.')
            }
        }

        Recipes.create(req.body, function(recipes){
            return res.redirect(`./recipes/${recipes.id}`)
        })
    },
    index(req, res){
        Recipes.all(function(recipes){
            return res.render("./admin/recipes/index.njk", { recipes })
        })
    },
    show(req, res){
        Recipes.find(req.params.id, function(recipe) {
            
            if (!recipe)
                return res.send('Receita não localizada.')                                    

            return res.render("./admin/recipes/show.njk", { recipe })
        }) 
    },
    exibe(req, res){
        Recipes.find(req.params.id, function(recipe) {
            
            if (!recipe)
                return res.send('Receita não localizada.')                                    

            return res.render("courses/show", { recipe })
        }) 
    },
    edit(req, res){        
        Recipes.find(req.params.id, function(recipe) {
            
            if (!recipe)
                return res.send('Receita não localizada.')                                    

            return res.render("./admin/recipes/edit.njk", { recipe })
        }) 
    },
    put(req, res){
        const keys = Object.keys(req.body)

        for (key of keys){
            if (req.body[key] == "") {
                return res.send('Por favor. Preencha todos os campos.')
            }
        }

        Recipes.update(req.body, function(){
            return res.redirect(`./recipes/${req.body.id}`)
        })
    },
    delete(req, res){
        Recipes.delete(req.body.id, function(){
            return res.redirect(`./recipes/`)
        })
    }
}