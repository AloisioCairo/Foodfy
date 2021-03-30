/* Trabalhando com banco de dados - Criando models e aprofundando em 
callback function */
const { age, date } = require('../../lib/utils')
const db = require('../../config/db')
const { off } = require('../../config/db')

module.exports = {
    maisAcessadas(callback) {
        db.query(` 
        SELECT recipes.id, title, chefs.name FROM recipes
        INNER JOIN chefs ON (chefs.id = recipes.chef_id)
        ORDER BY recipes."title" 
        LIMIT 6`, function (err, results) {

            if (err)
                throw `Erro na leitura dos dados no banco de dados: Receitas mais acessadas. ${err}`

            callback(results.rows)
        })
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
    create(data, callback) {
        const query = `INSERT INTO recipes (title, chef_id, ingredients, preparation, information, created_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id`

        const values = [
            data.title, data.chef, data.ingredients, data.preparation, data.information, date(Date.now()).iso
        ]

        return db.query(query, values)
        /*db.query(query, values, function (err, results) {
            if (err)
                throw `Erro no banco de dados. ${err}`

            callback(results.rows[0])
        })*/
    },
    find(id) {
        return db.query(`SELECT recipes.*, chefs.name FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE recipes.id = $1`, [id])
    },
    async update(data, callback) {

        const query = `UPDATE recipes SET chef_id = $1, title = $2, ingredients = $3, preparation = $4, 
                        information = $5 WHERE id = $6`

        const values = [
            data.chef, data.title, data.ingredients, data.preparation, data.information, data.id
        ]

        return db.query(query, values);
        /*db.query(query, values, function (err, results) {
            if (err)
                throw `Erro no banco de dados. ${err}`

            callback()
        })*/
    },
    delete(id, callback) {
        db.query(`DELETE FROM recipes WHERE id = $1`, [id], function (err, results) {
            if (err)
                throw `Erro ao tentar deletar a receita. ${err}`

            return callback()
        })
    },
    async chefSelectOptions() {
        return db.query(`SELECT id, name FROM chefs`)
    },
    findByReceitas(filter, callback) {
        db.query(`SELECT recipes.*, chefs.name FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE recipes.title ILIKE '%${filter}%' 
        ORDER BY recipes.title ASC`, function (err, results) {

            if (err)
                throw `Erro no banco de dados: Pesquisar receita pelo nome. ${err}`

            callback(results.rows)
        })
    },
    findOneImageRecipe(id_recipe) {
        return db.query(`SELECT files.path FROM files
            INNER JOIN recipe_files ON (recipe_files.file_id = files.id)
            WHERE recipe_files.recipe_id = $1
            ORDER BY files.id ASC
            LIMIT 1`, [id_recipe])
    },
    files(id_recipe) {
        return db.query(`SELECT recipe_files.id, files.path FROM files
            INNER JOIN recipe_files ON (recipe_files.file_id = files.id)
            WHERE recipe_files.recipe_id = $1
            ORDER BY files.id ASC`, [id_recipe])
    },
    paginate(params) {
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
    },
    paginateAdm(params) {
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
        //console.log(query)

        return db.query(query, [limit, offset], function (err, results) {
            if (err)
                throw 'Erro na leitura dos dados no banco de dados.'

            callback(results.rows)
        })
    }
}