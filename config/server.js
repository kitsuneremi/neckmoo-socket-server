const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const liveChats = require("../model/liveComments");
mongoose.connect("mongodb+srv://lily:lily@lily.nqsymng.mongodb.net/lily");

app.use(
    express.urlencoded({
        extended: true,
    })
);

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

io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("join", (data) => {
        console.log(`id ${data.id} joined room ${data.room}`);
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
server.listen(6074, () => {
    console.log("server started");
});
