/* Trabalhando com banco de dados - Criando models e aprofundando em callback function */
const db = require('../../config/db')
const Base = require('./Base')

Base.init({ table: 'chefs' })

module.exports = {
    ...Base,
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
    async findChef(id) {
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
    async recipesChef(id) {
        try {
            return db.query(`SELECT * FROM recipes WHERE chef_id = $1`, [id])
        } catch (err) {
            console.error('Erro ao selecionar as receitas de um chefe. Erro: ' + err)
        }
    },
    async file(id_chef) {
        try {
            return await db.query(`SELECT files.path
                                   FROM files
                                   LEFT JOIN chefs on (chefs.file_id = files.id)
                                   WHERE chefs.id = $1`, [id_chef])
        } catch (err) {
            console.error('Erro ao pesquisar por um chefe. Erro: ' + err)
        }
    }
}