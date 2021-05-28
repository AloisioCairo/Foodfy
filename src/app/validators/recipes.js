async function post(req, res, next) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") {
            return res.render("../views/admin/recipes/create", {
                alert: "Por favor. Preencha todos os campos."
            })
        }
    }


    if (!req.files || req.files.length == 0) {
        return res.render("../views/admin/recipes/create", {
            alert: "Por favor. Selecione ao menos uma foto."
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