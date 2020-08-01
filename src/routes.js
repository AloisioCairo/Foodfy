const express = require('express')
const routes = express.Router()
const recipes =  require('./app/controllers/recipes')

/* OK
routes.get("/", function(req, res){        
    return res.render("main/index.njk")
})
*/

routes.get("/", function(req, res){
    return res.redirect("/main")
})
routes.get("/main", recipes.maisAcessadas)

routes.get("/about", function(req, res){        
    return res.render("about/index.njk")
})

routes.get("/recipes", function(req, res){        
    return res.render("recipes/index.njk")
})

/*routes.get("/recipes", recipes.index)
routes.get("/recipes/create", recipes.create)
routes.get('/recipes/:id', recipes.show)
routes.get('/recipes/:id/edit', recipes.edit)
routes.post("/recipes", recipes.post)
routes.put("/recipes", recipes.put)
routes.delete('/recipes', recipes.delete)*/

module.exports = routes