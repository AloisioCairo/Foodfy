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
    },
    post(req, res){        
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
    },
    put(req, res){        
    },
    delete(req, res){
    }
}