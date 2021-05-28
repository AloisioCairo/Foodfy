const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    async create({ filename, path, recipe_id }) {
        try {
            let query = `INSERT INTO files (name, path)
            VALUES ($1, $2)
            RETURNING id`

            let values = [filename, path]

            if (recipe_id == 0) {
                return await db.query(query, values)
            }
            else if (recipe_id > 0) {
                let result = await db.query(query, values)

                const id_file = result.rows[0].id

                query = `INSERT INTO recipe_files (recipe_id, file_id)
            VALUES ($1, $2)
            RETURNING id`

                values = [recipe_id, id_file]

                return await db.query(query, values)
            }
        } catch (err) {
            console.error('Erro ao tentar inserir a image. Erro: ' + err)
        }
    },
    // async createChef({ filename, path }) {
    //     try {
    //         let query = `INSERT INTO files (name, path)
    //         VALUES ($1, $2)
    //         RETURNING id`

    //         let values = [filename, path]

    //         return await db.query(query, values)
    //     } catch (err) {
    //         console.error('Erro ao tentar inserir a image no cadastro chefe. Erro: ' + err)
    //     }
    // },
    async delete(id) {
        try {
            const result = await db.query(`SELECT recipe_files.file_id, files.path FROM files
                INNER JOIN recipe_files ON (recipe_files.file_id = files.id)
                WHERE recipe_files.id = $1`, [id])
            const file = result.rows[0]

            // Remove a imagem/arquivo da pasta "public"
            fs.unlinkSync(file.path)

            db.query(`DELETE FROM recipe_files WHERE id = $1`, [id])
            return db.query(`DELETE FROM files WHERE id = $1`, [file.file_id])
        } catch (err) {
            console.error('Erro ao tentar deletar a imagem. Erro: ' + err)
        }
    },
    async find(id_file) {
        try {
            return await db.query(`SELECT path FROM files WHERE id = $1`, [id_file])
        } catch (err) {
            console.error('Erro ao tentar pesquisar uma imagem. Erro: ' + err)
        }
    }
}