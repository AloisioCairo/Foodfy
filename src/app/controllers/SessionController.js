module.exports = {
    loginForm(req, res) {
        return res.render("./admin/session/login")
    },
    login(req, res) {
        return res.redirect("/admin/users")
    },
    forgotForm(req, res) {
        return res.render("./admin/session/forgot-password")
    },
    resetForm(req, res) {
        return res.render("./admin/session/password-reset")
    }
}