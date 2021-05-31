async function post(req, res, next) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "" && key != "removed_files")
            return res.render("../views/admin/users/create", {
                alert: "Por favor. Preencha todos os campos."
            })
    }

    next()
}

async function put(req, res, next) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "" && key != "removed_files")
            return res.send("Por favor. Preencha todos os campos.")
    }

    next()
}

module.exports = {
    post,
    put
}