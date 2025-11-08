import express from "express"
import "dotenv/config";
import cors from "cors"
import http from "http"
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";


const app = express();
const server = http.createServer(app);

// CORS setup
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({
  origin: CLIENT_URL,
  methods: ["GET", "POST"],
  credentials: true
}));

//Socket.io Server
export const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

//Store online users 
export const userSocketMap = {}; // { userId: socketId }

//Socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (!userId) return;

    // Add socket to user's list
    if (userSocketMap[userId]) {
        userSocketMap[userId].push(socket.id);
    } else {
        userSocketMap[userId] = [socket.id];
    }

    // Emit all online user IDs to everyone
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        if (userSocketMap[userId]) {
            userSocketMap[userId] = userSocketMap[userId].filter(
                (id) => id !== socket.id
            );
            if (userSocketMap[userId].length === 0) {
                delete userSocketMap[userId];
            }
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

//Middleware
app.use(express.json({limit: "4mb"}));
app.use(cors());

//Routes
app.use("/api/status", (req, res)=>{
    res.send("Server is running")
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter)

//Connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log("Server is running on" + PORT));

