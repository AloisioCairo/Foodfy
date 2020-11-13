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
    listAll(callback) {
        db.query(`SELECT chefs.name, chefs.avatar_url, COUNT(recipes.id) AS qtde_receitas FROM chefs
            LEFT JOIN recipes on (recipes.chef_id = chefs.id)  
            GROUP BY chefs.name, chefs.avatar_url `, function(err, results){
        
            if (err)
                throw `Erro na leitura dos dados no banco de dados: Todas as receitas. ${err}`

            callback(results.rows)
        }) 
    },
    create (data, callback){
        const query = `INSERT INTO chefs (name, avatar_url, created_at)
            VALUES ($1, $2, $3)
            RETURNING id`
        
        const values = [
            data.name, data.avatar_url, date(Date.now()).iso
        ]

        db.query(query, values, function(err, results){
            if (err)
            throw `Erro no banco de dados. ${err}`
                            
            callback(results.rows[0])
        })
    },
    find (id, callback) {
        db.query(`SELECT chefs.id, chefs.name, chefs.avatar_url, COUNT(recipes.id) AS qtde_receitas FROM chefs
            LEFT JOIN recipes on (recipes.chef_id = chefs.id)  
            WHERE chefs.id = $1
            GROUP BY chefs.id, chefs.name, avatar_url`, [id], function(err, results) {
            
            if (err)
                throw `Erro no banco de dados: Pesquisar pelo chefe. ${err}`

            callback(results.rows[0])
        })
    },
    findBy (filter, callback) {                       
    },
    update (data, callback){

        const query = `UPDATE chefs SET name = $1, avatar_url = $2 WHERE id = $3`

        const values = [
            data.name, data.avatar_url, data.id
        ]

        db.query(query, values, function(err, results){
            if (err)
            throw `Erro no banco de dados. ${err}`

            callback()
        })
    },
    delete(id, callback) {
        db.query(`DELETE FROM chefs WHERE id = $1`, [id], function(err, results){
            if (err)
                throw `Erro ao tentar deletar o(a) chefe. ${err}`

            return callback()        
        })
    },
    paginate(params){        
    }
}