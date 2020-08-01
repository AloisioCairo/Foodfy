/* Trabalhando com banco de dados - Criando models e aprofundando em 
callback function */
const { age, date } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    maisAcessadas(callback) {
        db.query(` 
        SELECT image, title, chefs.name FROM recipes
        INNER JOIN chefs ON (chefs.id = recipes.chef_id)
        ORDER BY recipes."title" `, function(err, results){
        
            if (err)
                throw `Erro na leitura dos dados no banco de dados. ${err}`

            callback(results.rows)
        }) 
    },
    all(callback) {        
    },
    create (data, callback){               
    },
    find (id, callback) {
    },
    findBy (filter, callback) {                       
    },
    update (data, callback){
    },
    delete(id, callback) {        
    },
    paginate(params){        
    }
}