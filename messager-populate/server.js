const express = require("express")
const cookieParser = require("cookie-parser")
require("dotenv").config()

const authRoutes = require("./Route/auth.route")
const messageRoutes = require("./Route/message.route")
const userRoutes = require("./Route/user.route")
const friendRoutes = require("./Route/friendList.route")
const { app, server } = require('./socket/socket')

// const app = express()  this line delete when socket apply 
const port = process.env.PORT || 8000

const connectdb = require("./Config/database")

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)
app.use("/api/users", userRoutes)
app.use("/api/friends", friendRoutes)


server.listen(port, () => {
    connectdb()
    console.log("code run on the port " + port)
})