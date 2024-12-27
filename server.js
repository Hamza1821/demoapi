const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity
        methods: ["GET", "POST"]
    }
});

// Serve a basic API endpoint
app.get('/', (req, res) => {
    res.send({ message: "Socket server is running!" });
});

// WebSocket event handlers
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for events
    socket.on('message', (data) => {
        console.log('Received message:', data);
        socket.emit('reply', `Server received: ${data}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Set Content Security Policy headers
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "connect-src 'self' ws://localhost:3000");
    next();
});

// Start the server and log connection details
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('WebSocket server is ready to accept connections!');
});
