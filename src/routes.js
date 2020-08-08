const express = require('express')
const routes = express.Router()
const recipes =  require('./app/controllers/recipes')

routes.get("/", function(req, res){
    return res.redirect("/courses")
})
routes.get("/courses", recipes.maisAcessadas)

routes.get("/recipes", function(req, res){        
    return res.redirect("/recipes/list")
    
    /*return res.render("recipes/index.njk")*/
})

routes.get("/about", function(req, res){        
    return res.render("about/index.njk")
})

routes.get("/recipes/list", recipes.index)
/*routes.get("/recipes/create", recipes.create)
routes.get('/recipes/:id', recipes.show)
routes.get('/recipes/:id/edit', recipes.edit)
routes.post("/recipes", recipes.post)
routes.put("/recipes", recipes.put)
routes.delete('/recipes', recipes.delete)*/

module.exports = routes