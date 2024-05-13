import { configDotenv } from "dotenv";
import { createClient } from "@libsql/client";
configDotenv(); 

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function getAllChat() {
  const chats = await client.execute("SELECT * FROM Chat");
  return chats; 
}; 

export async function createChat(idUsuario1, idUsuario2) {

  const idChat = crypto.randomUUID();

  try {
    const chat = await client.execute({
      sql: "INSERT INTO Chat (id_chat, id_usuario1, id_usuario2) VALUES (?,?,?)",
      args: [idChat, idUsuario1, idUsuario2]
    });
    
    return chat; 
    
  } catch (error) {
    return false; 
  }

}; 

export async function getChatsByUser1Id(idUsuario) {

  try {
    const chat = await client.execute({
      sql: "SELECT C.id_chat, U.nombre, U.img_perfil, U.id_usuario FROM Chat C, Usuario U WHERE C.id_usuario2 = U.id_usuario AND C.id_usuario1 = ?",
      args: [idUsuario]
    });
    
    if (chat.rows.length > 0)  return chat.rows; 
    
    return false; 

  } catch (error) {
    return false; 
  }

}; 

export async function getChatsByUser2Id(idUsuario) {
  try {
    const chat = await client.execute({
      sql: "SELECT C.id_chat, U.nombre, U.img_perfil, U.id_usuario FROM Chat C, Usuario U WHERE C.id_usuario1 = U.id_usuario AND C.id_usuario2 = ?",
      args: [idUsuario]
    });
    
    if (chat.rows.length > 0) {
      return chat.rows; 
    } else {
      return false; 
    }

  } catch (error) {
    return false; 
  }

}; 


