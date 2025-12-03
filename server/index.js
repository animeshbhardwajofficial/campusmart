const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config(); 
connectDB();

const authRoute = require('./routes/auth');
const itemsRoute = require('./routes/items');
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const userRoute = require("./routes/users");

const app = express();

app.use(cors({ origin: "*" })); 
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/items', itemsRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/users", userRoute);

// --- SOCKET.IO SETUP ---
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"],
    },
});

let users = [];

const addUser = (userId, socketId) => {
    // Only add if not already present to avoid duplicates in list
    if (!users.some((user) => user.userId === userId)) {
        users.push({ userId, socketId });
    }
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUserSockets = (userId) => {
    return users.filter((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    console.log("a user connected.");

    // 1. User Joins -> Broadcast "I am Online"
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users); // Send full list of online users to everyone
    });

    // 2. Send Message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const receiverSockets = getUserSockets(receiverId);
        receiverSockets.forEach((user) => {
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            });
        });
    });

    // 3. Typing Events (New)
    socket.on("typing", ({ senderId, receiverId }) => {
        const receiverSockets = getUserSockets(receiverId);
        receiverSockets.forEach((user) => {
            io.to(user.socketId).emit("displayTyping", { senderId });
        });
    });

    socket.on("stopTyping", ({ senderId, receiverId }) => {
        const receiverSockets = getUserSockets(receiverId);
        receiverSockets.forEach((user) => {
            io.to(user.socketId).emit("hideTyping", { senderId });
        });
    });

    // 4. Disconnect -> Broadcast "I am Offline"
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});

app.get('/', (req, res) => {
    res.send('Uni Marketplace API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});