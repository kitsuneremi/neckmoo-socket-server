const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const liveChats = require("../model/liveComments");
const messageModel = require("../model/message")

mongoose.connect("mongodb+srv://lily:lily@lily.nqsymng.mongodb.net/lily");

app.use(express.urlencoded({
    extended: true,
}));

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "http://localhost:3001",
            "https://www.erinasaiyukii.com",
            "https://erinasaiyukii.com",
            "https://lyart.pro.vn",
            "https://www.lyart.pro.vn",
            "https://lily-lyart.vercel.app"
        ],
        methods: ["GET", "POST"],
    },
});

// Middleware to handle /live route
app.use("/live", (req, res, next) => {
    io.on("connection", (socket) => {
        console.log(`[Live] New connection: ${socket.id}`);

        socket.on("join", (data) => {
            console.log(`[Live] id ${data.id} joined room ${data.room}`);
            socket.join(data.room);
        });

        socket.on("sendmsg", (data) => {
            socket.to(data.room).emit("rcvmsg", data);
            liveChats.create({
                accountId: data.accountId,
                name: data.name,
                image: data.image,
                content: data.content,
                room: data.room,
            });
        });
    });

    next();
});

// Middleware to handle /chat route
app.use("/chat", (req, res, next) => {
    io.on("connection", (socket) => {
        console.log(`[Chat] New connection: ${socket.id}`);

        // Handle chat-specific logic here

        // Example: Join a chat room
        socket.on("join", (room) => {
            console.log(`[Chat] ${socket.id} joined chat room ${room}`);
            socket.join(room);
        });

        // Example: Handle chat messages
        socket.on("sendmsg", (message) => {
            console.log(`[Chat] Received message: ${message}`);
            // Process and broadcast the message
            io.to("chatRoom").emit("rcvmsg", message);
            messageModel.create({
                memberId: message.memberId,
                roomId: message.roomId,
                file: message.file,
                content: message.content
            })
        });
    });

    next();
});

server.listen(6074, () => {
    console.log("Server started");
});
