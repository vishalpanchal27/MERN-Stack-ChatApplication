const express = require("express")
const { signup, login, logout } = require("../Controller/auth.controller")
const route = express.Router()

route.post("/signup", signup)
//http://127.0.0.1/api/auth/signup

route.post("/login", login)
//http://127.0.0.1/api/auth/login

route.post("/logout", logout)
//http://127.0.0.1/api/auth/logout

module.exports = route;