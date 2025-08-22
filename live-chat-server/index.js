const express = require('express')
const mongoose = require('mongoose')
const http = require("http")
const dotenv = require('dotenv')
const userRoute = require('./Routes/userRoute')
// const messageRoute = require("./Routes/messageRoute")
// const chatRoute = require("./Routes/chatRoute")
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { Server } = require("socket.io")
const app = express()
const server = http.createServer(app)
const io = new Server(server)

io.on("connection", (socket) => {
    socket.on("msg", (message) => {
        io.emit("msg", message)
    })
})

dotenv.config();
app.use(cors())
app.use(cookieParser())
app.use(express.json())

const connectdb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI,);
        console.log('connection of db is successfuly' + connect)
    }
    catch (error) {
        console.log(error)
    }
}
connectdb();



app.get('/', (req, res) => {
    res.send('hello this is the my first MERN project')
})
app.use("/user", userRoute)
// app.use("/chat", chatRoute)
// app.use("/message", messageRoute)

const PORT = process.env.PORT || 9000;

app.listen(PORT, console.log('server is statted on the port no ' + PORT))