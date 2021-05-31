const db = require('../../config/db')
const Base = require('./Base')

Base.init({ table: 'users' })

module.exports = {
    ...Base,
    async updateField(id, fields) {
        try {
            let query = "UPDATE users SET"

            Object.keys(fields).map((key, index, array) => {
                if ((index + 1) < array.length) {
                    query = `${query}
                            ${key} = '${fields[key]}',
                        `
                } else {
                    query = `${query}
                            ${key} = '${fields[key]}'
                            WHERE id = ${id}
                        `
                }
            })

            await db.query(query)
            return
        } catch (err) {
            console.error('Erro ao tentar atualizar campos do cadastro do usuário. Erro: ' + err)
        }
    },
    async isAdmin(id) {
        try {
            return await db.query('SELECT is_admin FROM users WHERE id = $1', [id])
        } catch (err) {
            console.error('Erro ao executar a função "idAdmin". Erro: ' + err)
        }

    }
}