const express = require("express") 
const cros =require("cors")
const mongoose = require("mongoose")
const userRoutes=require("./routes/userRoutes")
const message=require("./routes/messages")
const socket = require("socket.io"); 
const app = express();
require("dotenv").config(); 

app.use(cros());
app.use(express.json());
 
app.use("/api/auth",userRoutes)
app.use("/api/messages",message)
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true, 
    useUnifiedTopology:true 
    
}).then(()=>{
    console.log("DB Connection Successfull")
}).catch((err)=>{
    console.log(`DB ${err.message}`);
});

const server =app.listen(process.env.PORT,()=>{
    console.log(`Server Started on Port ${process.env.PORT}`);
})

const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });
  