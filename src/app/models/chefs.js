/* Trabalhando com banco de dados - Criando models e aprofundando em 
callback function */
const { age, date } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    all(callback) {
        db.query(` 
          SELECT id, name, avatar_url FROM chefs
          ORDER BY name ASC `, function(err, results){
        
            if (err)
                throw `Erro na leitura dos dados no banco de dados: Todas as receitas. ${err}`

            callback(results.rows)
        }) 
    },
    create (data, callback){
        const query = `INSERT INTO recipes (chef_id, image, title, ingredients, preparation, information, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id`
        
        const values = [
            data.chef_id, data.image, data.title, data.ingredients, data.preparation, data.information, date(Date.now()).iso
        ]

        db.query(query, values, function(err, results){
            if (err)
            throw `Erro no banco de dados. ${err}`
                            
            callback(results.rows[0])
        })
    },
    find (id, callback) {
        db.query(`SELECT name, avatar_url, COUNT(recipes.id) AS qtde_receitas FROM chefs
            LEFT JOIN recipes on (recipes.chef_id = chefs.id)  
            WHERE chefs.id = $1
            GROUP BY name, avatar_url`, [id], function(err, results) {
            
            if (err)
                throw `Erro no banco de dados: Pesquisar pelo chefe. ${err}`

            callback(results.rows[0])
        })
    },
    findBy (filter, callback) {                       
    },
    update (data, callback){

        const query = `UPDATE recipes SET chef_id = $1, image = $2, ingredients = $3, preparation = $4, 
                        information = $5 WHERE id = $6`

        const values = [
            data.chef_id, data.image, data.ingredients, data.preparation, data.information, data.id
        ]

        db.query(query, values, function(err, results){
            if (err)
            throw `Erro no banco de dados. ${err}`

            callback()
        })
    },
    delete(id, callback) {
        db.query(`DELETE FROM recipes WHERE id = $1`, [id], function(err, results){
            if (err)
                throw `Erro ao tentar deletar a receita. ${err}`

            return callback()        
        })
    },
    paginate(params){        
    }
}