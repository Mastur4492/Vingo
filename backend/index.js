import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import userRouter from "./routes/user.routes.js"

import itemRouter from "./routes/item.routes.js"
import shopRouter from "./routes/shop.routes.js"
import orderRouter from "./routes/order.routes.js"
import http from "http"
import { Server } from "socket.io"
import { socketHandler } from "./socket.js"

const app = express()
const server = http.createServer(app)

// allow both local development and the deployed frontend origin.
// the frontend URL can be set via the FRONTEND_URL environment variable
// (useful if it ever changes without touching code)
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL || "https://vingo-9j0q.onrender.com"
];

const io=new Server(server,{
   cors:{
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // mobile apps or curl
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials:true,
    methods:['POST','GET','PUT','DELETE','OPTIONS']
}
})

app.set("io", io)



const port = process.env.PORT || 5000
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials:true,
    methods:['GET','POST','PUT','DELETE','OPTIONS']
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/shop", shopRouter)
app.use("/api/item", itemRouter)
app.use("/api/order", orderRouter)
socketHandler(io)
server.listen(port, () => {
    connectDb()
    console.log(`server started at ${port}`)
})

