const Recipe = require('../models/recipes')
const Chef = require('../models/chefs')

async function getImages(recipeId) {
    let files = await Recipe.files(recipeId)
    files = files.map(file => ({
        ...file,
        src: `${file.path.replace("public", "")}`
    }))

    return files
}

async function nameChef(recipe) {
    let chef = await Chef.find(recipe.chef_id)

    return chef
}

async function format(recipe) {
    const files = await getImages(recipe.id)

    if (files.length != '') {
        recipe.img = files[0].src
        recipe.files = files
    }

    const chef = await nameChef(recipe)
    recipe.nameChef = chef.name

    return recipe
}

const LoadService = {
    load(service, filter) {
        this.filter = filter
        return this[service]()
    },
    async recipe() {
        try {
            const recipe = await Recipe.findOne(this.filter)
            return format(recipe) // Retorna uma promisse da receita

        } catch (error) {
            console.error(error)
        }
    }
    // ,
    // async recipes() {
    //     try {
    //         const recipes = await Recipe.findAll(this.filter)
    //         const recipesPromise = recipes.map(format)

    //         return await Promise.all(recipesPromise)
    //     } catch (error) {
    //         console.error(error)
    //     }
    // },
    // format,
}

module.exports = LoadService