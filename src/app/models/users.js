const db = require('../../config/db')
const { age, date } = require('../../lib/utils')

module.exports = {
    async all() {
        try {
            return db.query(`SELECT * FROM users ORDER BY name ASC`)

        } catch (err) {
            console.error('Ocorreu um erro ao pesquisar por todos os cadastros de usuários. Erro: ' + err)
        }
    },
    create(data) {
        try {
            const query = `INSERT INTO users (name, email, password, reset_token, reset_token_expires, is_admin, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id`

            const values = [
                data.name, data.email, data.password || 1, data.reset_token, data.reset_token_expires, data.is_admin, date(Date.now()).iso
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
    update(id) {

    },
    delete(id) {

    }
}