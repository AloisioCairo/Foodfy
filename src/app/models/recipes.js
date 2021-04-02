/* Trabalhando com banco de dados - Criando models e aprofundando em 
callback function */
const { age, date } = require('../../lib/utils')
const db = require('../../config/db')
const { off } = require('../../config/db')

module.exports = {
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
    all(req, res) {
        /*
        if (filter) {
            db.query(` 
            SELECT recipes.id, image, title, chefs.name FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            WHERE recipes.title ILIKE '%${filter}%'
            OR chefs.name ILIKE '%${filter}%'
            ORDER BY recipes."title" `, function (err, results) {

                if (err)
                    throw `Erro na leitura dos dados no banco de dados: Todas as receitas. ${err}`

                callback(results.rows)
            })
        }
        else {
            db.query(` 
            SELECT recipes.id, image, title, chefs.name FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            ORDER BY recipes."title" `, function (err, results) {

                if (err)
                    throw `Erro na leitura dos dados no banco de dados: Todas as receitas. ${err}`

                callback(results.rows)
            })
        }
        */
    },
    create(data) {
        try {
            const query = `INSERT INTO recipes (title, chef_id, ingredients, preparation, information, created_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id`

            const values = [
                data.title, data.chef, data.ingredients, data.preparation, data.information, date(Date.now()).iso
            ]

            return db.query(query, values)
        } catch (err) {
            console.error('Erro ao cadastrar uma nova receita. Erro: ' + err)
        }
    },
    async find(id) {
        try {
            return db.query(`SELECT recipes.*, chefs.name FROM recipes
                LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
                WHERE recipes.id = $1`, [id])
        } catch (err) {
            console.error('Erro ao pesquisar por uma receita. Erro: ' + err)
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
    delete(id, callback) {
        try {
            db.query(`DELETE FROM recipes WHERE id = $1`, [id], function (err, results) {
                if (err)
                    throw `Erro ao tentar deletar a receita. ${err}`

                return callback()
            })
        } catch (err) {
            console.error('Erro ao deletar uma receita. Erro: ' + err)
        }
    },
    async chefSelectOptions() {
        try {
            return db.query(`SELECT id, name FROM chefs`)
        } catch (err) {
            console.error('Erro ao selecionar todos os cadastros de chefes. Erro: ' + err)
        }
    },
    findByReceitas(filter, callback) {
        try {
            db.query(`SELECT recipes.*, chefs.name FROM recipes
                LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
                WHERE recipes.title ILIKE '%${filter}%' 
                ORDER BY recipes.title ASC`, function (err, results) {

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
    files(id_recipe) {
        try {
            return db.query(`SELECT recipe_files.id, files.path FROM files
                INNER JOIN recipe_files ON (recipe_files.file_id = files.id)
                WHERE recipe_files.recipe_id = $1
                ORDER BY files.id ASC`, [id_recipe])
        } catch (err) {
            console.error('Erro ao pesquisar as imagens de uma receita. Erro: ' + err)
        }
    },
    paginate(params) {
        try {
            const { filter, limit, offset, callback } = params

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
            LIMIT $1 OFFSET $2
            `

            db.query(query, [4, offset], function (err, results) {
                if (err)
                    throw 'Erro na leitura dos dados no banco de dados.'

                callback(results.rows)
            })
        } catch (err) {
            console.error('Erro na paginação de receitas. Erro: ' + err)
        }
    },
    paginateAdm(params) {
        try {
            const { filter, limit, offset, callback } = params

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
                LIMIT $1 OFFSET $2
            `

            return db.query(query, [limit, offset], function (err, results) {
                if (err)
                    throw 'Erro na leitura dos dados no banco de dados.'

                callback(results.rows)
            })
        } catch (err) {
            console.error('Erro na paginação administrativa de receitas. Erro: ' + err)
        }
    }
}