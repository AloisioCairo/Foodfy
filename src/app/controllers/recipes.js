const { age, date, format } = require('../../lib/utils')
const Recipes = require('../models/recipes')

module.exports = {    
    maisAcessadas(req, res){
        Recipes.maisAcessadas(function(recipes){
            return res.render(`main/index.njk`, { recipes })
        })
    },
    index(req, res){
        return res.render("recipes/index")
    },
    create(req, res){        
    },
    post(req, res){        
    },
    show(req, res){                
    },
    edit(req, res){        
    },
    put(req, res){        
    },
    delete(req, res){
    }
}