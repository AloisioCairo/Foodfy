const recipeModel = require('../models/recipes')

module.exports = {
    async index(req, res) {
        try {
            // Seleciona as receitas cadastrada pelo usuário
            const result = await recipeModel.recipeUser(req.session.userId)
            const recipesUser = result.rows

            // Retorna a imagem principal da receita
            async function getImage(recipeId) {
                let results = await recipeModel.findOneImageRecipe(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

                return files[0]
            }

            // Essa const retorna um array com os dados das receitas
            const recipesPromise = recipesUser.map(async recipe => {
                recipe.img = await getImage(recipe.id)

                return recipe
            })
            const recipesAdded = await Promise.all(recipesPromise)

            return res.render("./admin/profile/index", { user: req.session.user, recipeUser: recipesAdded })
        } catch (error) {
            console.error('Erro ao tentar exibir o dados do usuário logado. Erro: ' + error)
        }
    },
    async put(req, res) {
        try {

        } catch (error) {
            console.error('Erro ao tentar atualizar o cadastro do usuário. Erro: ' + error)
        }
    }
}