const express = require('express');
const http = require('http');
// const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
// const io = socketIo(server);

// Set EJS as the template engine
app.set('views', path.join(__dirname, 'modules', 'Api_document', 'view'));
app.set('view engine', 'ejs');

// Serve static files (optional)
app.use(express.static(path.join(__dirname, 'public')));

// Use the existing route file
const router = require('./route.js');
app.use('/', router);

// Socket.io connection
// io.on('connection', (socket) => {
//     console.log('A user connected');
// });

// Start server
const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));