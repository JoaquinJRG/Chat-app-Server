import express from "express";
import http from "node:http"; 
import cors from "cors"; 
import { Server } from "socket.io"; 
import { configDotenv } from "dotenv";
import routes from "./routes.js"; 
import {insertMessage, deleteMessage, editMessage} from "./models/mensaje.js";

//Configuración
configDotenv(); 
const PORT = process.env.PORT; 
const app = express();
const server = http.createServer(app); 
app.use(cors()); 
app.use(express.json()); 
app.use("/", routes); 

const io = new Server(server, {
  cors: {
    origin: "https://chat-app-client-alpha.vercel.app",
  }
}); 

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("join_room", (data) => {
    socket.join(data); 
  });

  socket.on("send_message", async (msg) => {
    
    //Guardar mensaje en base de datos
    const result = await insertMessage(msg.id_mensaje, msg.id_chat, msg.texto, msg.usuario_envia, msg.usuario_recibe, msg.fecha);
    //Enviar mensaje
    socket.to(msg.id_chat).emit("recive_message", msg);

  });

  socket.on("typing", (idChat) => {
    socket.to(idChat).emit("is_typing"); 
  });

  socket.on("delete_message", async (data) => {
    await deleteMessage(data.idMsg); 
    
    socket.to(data.idChat).emit("message_deleted", data.idMsg);

  });

  socket.on("edit_message", async (data) => {
    await editMessage(data.newText, data.idMensaje);

    socket.to(data.idChat).emit("message_edited", {newText: data.newText, idMsg: data.idMensaje});
  });

});

//LISTEN
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`); 
}); 



