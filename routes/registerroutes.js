const express=require("express");
const app = express.Router()
const {register, login, getUser} = require("../controllers/registercontroller")

app.post("/register", register)
app.get("/getuser", getUser)
app.post("/loginafter", login)

module.exports = app