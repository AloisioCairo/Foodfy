/* Trabalhando com banco de dados - Criando models e aprofundando em 
callback function */
const { age, date } = require('../../lib/utils')
const db = require('../../config/db')
const { off } = require('../../config/db')

module.exports = {
    maisAcessadas(callback) {
        db.query(` 
        SELECT recipes.id, image, title, chefs.name FROM recipes
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
        const query = `INSERT INTO recipes (title, image, chef_id, ingredients, preparation, information, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id`

        const values = [
            data.title, data.image, data.chef, data.ingredients, data.preparation, data.information, date(Date.now()).iso
        ]

        db.query(query, values, function (err, results) {
            if (err)
                throw `Erro no banco de dados. ${err}`

            callback(results.rows[0])
        })
    },
    find(id, callback) {
        db.query(`SELECT recipes.*, chefs.name FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE recipes.id = $1`, [id], function (err, results) {

            if (err)
                throw `Erro no banco de dados: Pesquisar pela receita. ${err}`

            callback(results.rows[0])
        })
    },
    update(data, callback) {

        const query = `UPDATE recipes SET chef_id = $1, title = $2, image = $3, ingredients = $4, preparation = $5, 
                        information = $6 WHERE id = $7`

        const values = [
            data.chef, data.title, data.image, data.ingredients, data.preparation, data.information, data.id
        ]

        db.query(query, values, function (err, results) {
            if (err)
                throw `Erro no banco de dados. ${err}`

            callback()
        })
    },
    delete(id, callback) {
        db.query(`DELETE FROM recipes WHERE id = $1`, [id], function (err, results) {
            if (err)
                throw `Erro ao tentar deletar a receita. ${err}`

            return callback()
        })
    },
    chefSelectOptions(callback) {
        db.query(`SELECT id, name FROM chefs`, function (err, results) {
            if (err)
                throw `Erro ao tentar buscar os chefes. ${err}`

            callback(results.rows)
        })
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
            SELECT recipes.id, image, title, chefs.name, ${totalQuery}
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
            SELECT recipes.id, image, title, chefs.name, ${totalQuery}
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
    }
}