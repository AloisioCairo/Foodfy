const db = require('../../config/db')
const fs = require('fs')
const { Console } = require('console')

module.exports = {
    async create({ filename, path, recipe_id }) {
        let query = `INSERT INTO files (name, path)
            VALUES ($1, $2)
            RETURNING id`

        let values = [filename, path]
        let result = await db.query(query, values)

        const id_file = result.rows[0].id

        if (recipe_id > 0) {
            query = `INSERT INTO recipe_files (recipe_id, file_id)
            VALUES ($1, $2)
            RETURNING id`

            values = [recipe_id, id_file]

            return await db.query(query, values)
        }
    },
    async delete(id) {
        try {
            console.log('id_' + id)

            const result = await db.query(`SELECT recipe_files.file_id, files.path FROM files
                INNER JOIN recipe_files ON (recipe_files.file_id = files.id)
                WHERE recipe_files.id = $1`, [id])
            const file = result.rows[0]

            console.log('file.path_' + file.path)

            // Remove a imagem/arquivo da pasta "public"
            fs.unlinkSync(file.path)

            /*result = await db.query(`SELECT file_id FROM recipe_files WHERE id = $1`, [id])
            file = result.rows[0].file_id*/

            console.log('file_' + file)

            db.query(`DELETE FROM recipe_files WHERE id = $1`, [id])
            return db.query(`DELETE FROM files WHERE id = $1`, [file.file_id])
        } catch (err) {
            console.error(err)
        }
    },
}