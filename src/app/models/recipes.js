/* Trabalhando com banco de dados - Criando models e aprofundando em 
callback function */
const { age, date } = require('../../lib/utils')
const db = require('../../config/db')
const { off } = require('../../config/db')
const fs = require('fs')
const Base = require('./Base')
const { Console } = require('console')

Base.init({ table: 'recipes' })

module.exports = {
    ...Base,
    async maisAcessadas() {
        try {
            return db.query(`SELECT recipes.id, title, chefs.name FROM recipes
                INNER JOIN chefs ON (chefs.id = recipes.chef_id)
                ORDER BY recipes."title" 
                LIMIT 6`)
        } catch (err) {
            console.error('Erro ao tentar pesquisar pelas receitas mais acessadas. Erro: ' + err)
        }
    },
    async chefSelectOptions() {
        try {
            const results = await db.query(`SELECT id, name FROM chefs`)
            return results.rows
        } catch (err) {
            console.error('Erro ao selecionar todos os cadastros de chefes. Erro: ' + err)
        }
    },
    findByReceitas(filter, callback) {
        try {
            db.query(`SELECT recipes.*, chefs.name FROM recipes
                LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
                WHERE recipes.title ILIKE '%${filter}%' 
                ORDER BY recipes.created_at ASC`, function (err, results) {

                if (err)
                    throw `Erro no banco de dados: Pesquisar receita pelo nome. ${err}`

                callback(results.rows)
            })
        } catch (err) {
            console.error('Erro ao pesquisar por receitas. Erro: ' + err)
        }
    },
    findOneImageRecipe(id_recipe) {
        try {
            return db.query(`SELECT files.path FROM files
                INNER JOIN recipe_files ON (recipe_files.file_id = files.id)
                WHERE recipe_files.recipe_id = $1
                ORDER BY files.id ASC
                LIMIT 1`, [id_recipe])
        } catch (err) {
            console.error('Erro ao pesquisar pela principal imagem de uma receita. Erro: ' + err)
        }
    },
    async files(id_recipe) {
        try {
            const results = await db.query(`SELECT recipe_files.id, recipe_files.file_id, files.path FROM files
                INNER JOIN recipe_files ON (recipe_files.file_id = files.id)
                WHERE recipe_files.recipe_id = $1
                ORDER BY files.id ASC`, [id_recipe])

            return results.rows
        } catch (err) {
            console.error('Erro ao pesquisar as imagens de uma receita. Erro: ' + err)
        }
    },
    async userRecipe(id_recipe) {
        try {
            return await db.query('SELECT user_id FROM recipes WHERE id = $1', [id_recipe])
        } catch (err) {
            console.error('Erro ao pesquisar o usuário responsável pela receita. Erro: ' + err)
        }
    },
    async paginate(params) {
        try {
            const { filter, limit, offset } = params

            let query = ""
            filterQuery = ""
            totalQuery = "(SELECT COUNT(*) FROM recipes) AS total"

            if (filter) {
                filterQuery = `${query}
            WHERE recipes.title ILIKE '%${filter}%'
            OR chefs.name ILIKE '%${filter}%'
            `
                totalQuery = `(SELECT COUNT(*) FROM recipes
            ${filterQuery}) AS total
            `
            }

            query = `
            SELECT recipes.id, title, chefs.name, ${totalQuery}
            FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            ${filterQuery}
            ORDER BY recipes.updated_at ASC
            LIMIT $1 OFFSET $2
            `

            return db.query(query, [4, offset])
        } catch (err) {
            console.error('Erro na paginação de receitas. Erro: ' + err)
        }
    },
    async paginateAdm(params) {
        try {
            const { filter, limit, offset } = params

            let query = ""
            filterQuery = ""
            totalQuery = "(SELECT COUNT(*) FROM recipes) AS total"

            if (filter) {
                filterQuery = `${query}
                WHERE recipes.title ILIKE '%${filter}%'
                OR chefs.name ILIKE '%${filter}%'
                `
                totalQuery = `(SELECT COUNT(*) FROM recipes
                    ${filterQuery}) AS total
                `
            }

            query = `
                SELECT recipes.id, title, chefs.name, ${totalQuery}
                FROM recipes
                LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
                ${filterQuery}
                ORDER BY recipes.created_at ASC
                LIMIT $1 OFFSET $2
            `
            return db.query(query, [limit, offset])
        } catch (err) {
            console.error('Erro na paginação administrativa de receitas. Erro: ' + err)
        }
    },
    async recipeUser(id_user) {
        try {
            return db.query(`SELECT recipes.id, title, chefs.name FROM recipes
                INNER JOIN chefs ON (chefs.id = recipes.chef_id)
                WHERE recipes.user_id = $1
                ORDER BY recipes."title"`, [id_user])
        } catch (err) {
            console.error('Erro ao tentar selecionar as receitas cadastradas pelo usuário. Erro: ' + err)
        }
    },
    create(data) {
        try {
            const query = `INSERT INTO recipes (title, chef_id, ingredients, preparation, information, created_at, user_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id`

            const values = [
                data.title, data.chef, data.ingredients, data.preparation, data.information, date(Date.now()).iso, data.user_id
            ]

            return db.query(query, values)
        } catch (err) {
            console.error('Erro ao cadastrar uma nova receita. Erro: ' + err)
        }
    },
    async update(data) {
        try {
            const query = `UPDATE recipes SET chef_id = $1, title = $2, ingredients = $3, preparation = $4, 
                        information = $5 WHERE id = $6`

            const values = [
                data.chef, data.title, data.ingredients, data.preparation, data.information, data.id
            ]

            return db.query(query, values);
        } catch (err) {
            console.error('Erro ao atualizar o cadastro de uma receita. Erro: ' + err)
        }
    },
    async delete(id, callback) {
        try {
            let recipeFiles = await this.files(id)

            db.query(`DELETE FROM recipe_files WHERE recipe_id = $1`, [id])

            for (i = 0; i < recipeFiles.length; i++) {
                db.query(`DELETE FROM files WHERE id = $1`, [recipeFiles[i].file_id])

                // Remove as imagens dos produtos que estão na pasta "public/images"
                fs.unlinkSync(recipeFiles[i].path)
            }

            db.query(`DELETE FROM recipes WHERE id = $1`, [id])
        } catch (err) {
            console.error('Erro ao deletar uma receita. Erro: ' + err)
        }
    }
}
