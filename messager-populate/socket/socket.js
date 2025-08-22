const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("../Models/user.model"); // Make sure path is correct

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);

    // join a chat roomfdda
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`✅ ${socket.id} joined room ${roomId}`);
    });

    // leave room
    socket.on("leaveRoom", (roomId) => {
        socket.leave(roomId);
        console.log(`❌ ${socket.id} left room ${roomId}`);
    });

    // new message
    socket.on("newMessage", async (objMsg) => {
        if (!objMsg?.roomId) return;
        console.log("💬 New message:", objMsg);

        // Save/update user status if needed
        try {
            await User.findByIdAndUpdate(objMsg.senderId, { isOnline: true });
            socket.broadcast.emit("user-status", { userId: objMsg.senderId, isOnline: true });
        } catch (err) {
            console.error("DB Update Error:", err);
        }

        // send message to everyone in the room
        io.to(objMsg.roomId).emit("receiveMessage", objMsg);
    });

    // test event
    socket.on("updateLiveMessage", (data) => {
        console.log("📢 updateLiveMessage:", data);
        io.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("⚠️ User disconnected:", socket.id);
    });
});
////asd
// Attach io to requests
app.use((req, res, next) => {
    req.io = io;
    next();
});
//adad
module.exports = { app, server, io };
