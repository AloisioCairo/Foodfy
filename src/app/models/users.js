const db = require('../../config/db')
const { age, date } = require('../../lib/utils')
const { hash } = require('bcryptjs') // Biblioteca para fazer o hash da senha

module.exports = {
    async all() {
        try {
            return db.query(`SELECT * FROM users ORDER BY name ASC`)

        } catch (err) {
            console.error('Ocorreu um erro ao pesquisar por todos os cadastros de usuários. Erro: ' + err)
        }
    },
    async create(data) {
        try {
            const query = `INSERT INTO users (name, email, password, reset_token, reset_token_expires, is_admin, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id`

            data.password = '123'
            const passwordHash = await hash(data.password, 8)

            const values = [
                data.name, data.email, passwordHash || 1, data.reset_token, data.reset_token_expires, data.is_admin, date(Date.now()).iso
            ]

            return db.query(query, values)
        } catch (err) {
            console.error('Erro ao cadastrar um novo usuário. Erro: ' + err)
        }
    },
    find(id) {
        try {
            return db.query(`SELECT * FROM users WHERE id = $1`, [id])
        } catch (err) {
            console.error('Erro ao tentar pesquisar pelo cadastr do usuário. Erro: ' + err)
        }
    },
    async findOne(filters) {
        let query = "SELECT * FROM users"

        Object.keys(filters).map(key => {
            // WHERE | OR | AND

            query = `${query}
                ${key}
            `

            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })

        const results = await db.query(query)
        return results.rows[0]
    },
    update(data) {
        try {
            const query = `UPDATE users SET name = $1, is_admin = $2 WHERE id = $3`

            const values = [
                data.name, data.is_admin, data.id
            ]

            return db.query(query, values);
        } catch (err) {
            console.error('Erro ao tentar atualizar o cadastro do usuário. Erro: ' + err)
        }
    },
    async delete(id) {
        try {
            let result = await db.query(`SELECT recipes.id from recipes 
                INNER JOIN users ON (users.id = recipes.user_id)
                WHERE recipes.user_id = $1
                LIMIT 1`, [id])
            const recipe = result.rows[0]

            if (recipe != null) {
                console.log('null')
                return recipe
            } else {
                console.log('SQL_delete_SQL_delete')
                db.query(`DELETE FROM users WHERE id = $1`, [id])
                return recipe
            }

        } catch (err) {
            console.error('Erro ao tentar excluir o cadastro de um usuário. Erro: ' + err)
        }

    }
}