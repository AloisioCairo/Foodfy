/* Trabalhando com banco de dados - Criando models e aprofundando em 
callback function */
const { age, date } = require('../../lib/utils')
const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    async all(filter) {
        try {
            if (filter) {
                return db.query(`SELECT id, name FROM chefs
                                 WHERE name ILIKE '%${filter}%'
                                 ORDER BY name ASC`)
            } else {
                return db.query(`SELECT id, name FROM chefs
                                 ORDER BY name ASC`)
            }
        } catch (err) {
            console.error('Erro ao filtrar cadastro de chefes. Erro: ' + err)
        }
    },
    async listAll() {
        try {
            return db.query(`SELECT chefs.id, chefs.name, COUNT(recipes.id) AS qtde_receitas FROM chefs
                LEFT JOIN recipes on (recipes.chef_id = chefs.id)  
                GROUP BY chefs.id, chefs.name`)
        } catch (err) {
            console.error('Erro ao listar todos os chefes. Erro: ' + err)
        }
    },
    async create(data, id_file) {
        try {
            const query = `INSERT INTO chefs (name, created_at, file_id)
            VALUES ($1, $2, $3)
            RETURNING id`

            const values = [
                data.name, date(Date.now()).iso, id_file
            ]

            return db.query(query, values)
        } catch (err) {
            console.error('Erro ao cadastrar um novo chefe. Erro: ' + err)
        }
    },
    async find(id) {
        try {
            return await db.query(`SELECT chefs.id, chefs.name, COUNT(recipes.id) AS qtde_receitas, files.path
                FROM chefs
                LEFT JOIN recipes on (recipes.chef_id = chefs.id)
                LEFT JOIN files on (chefs.file_id = files.id)
                WHERE chefs.id = $1
                GROUP BY chefs.id, chefs.name, chefs.file_id, files.path`, [id])
        } catch (err) {
            console.error('Erro ao pesquisar por um chefe. Erro: ' + err)
        }
    },
    update(data, callback) {
        try {
            const query = `UPDATE chefs SET name = $1 WHERE id = $2`

            const values = [
                data.name, data.id
            ]

            db.query(query, values, function (err, results) {
                if (err)
                    throw `Erro no banco de dados. ${err}`

                callback()
            })
        } catch (err) {
            console.error('Erro ao atualizar o cadastro de um chefe. Erro: ' + err)
        }
    },
    async delete(id, callback) {
        try {
            db.query(`SELECT id FROM recipes WHERE chef_id = $1`, [id], function (err, results) {
                if (err)
                    throw `Erro ao tentar deletar o(a) chefe. ${err}`

                if (results.rows[0] != null) {
                    callback(results.rows[0])
                }
                else {
                    db.query(`DELETE FROM chefs WHERE id = $1`, [id], function (err, results) {
                        if (err)
                            throw `Erro ao tentar deletar o(a) chefe. ${err}`

                        return callback()
                    })
                }
            })
        } catch (err) {
            console.error('Erro ao deletar o cadastro de um chefe. Erro: ' + err)
        }
    },
    async recipesChef(id) {
        try {
            return db.query(`SELECT * FROM recipes WHERE chef_id = $1`, [id])
        } catch (err) {
            console.error('Erro ao selecionar as receitas de um chefe. Erro: ' + err)
        }
    },
    async file(id) {
        try {
            return await db.query(`SELECT files.path
                                   FROM files
                                   LEFT JOIN chefs on (chefs.file_id = files.id)
                                   WHERE chefs.id = $1`, [id])
        } catch (err) {
            console.error('Erro ao pesquisar por um chefe. Erro: ' + err)
        }
    },
    async fileImg(id) {
        try {
            return await db.query(`SELECT files.path
                                   FROM files
                                   LEFT JOIN chefs on (chefs.file_id = files.id)
                                   WHERE chefs.id = $1`, [id])
        } catch (err) {
            console.error('Erro ao pesquisar por um chefe. Erro: ' + err)
        }
    }
}