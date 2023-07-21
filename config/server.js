const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io')

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
        origin: ['http://localhost:3000', 'http://localhost:3001', 'https://www.erinasaiyukii.com', ''],
        methods: ['GET', 'POST']
    }
})

io.on('connection', socket => {
    console.log(socket.id)

    socket.on('join', data => {
        console.log(`id ${data.id} joined room ${data.room}`)
        socket.join(data.room)
    })

    socket.on('sendmsg', data => {
        console.log(data)
        socket.to(data.room).emit('rcvmsg', data)
    })
})
server.listen(6075)