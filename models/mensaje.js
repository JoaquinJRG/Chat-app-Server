import { configDotenv } from "dotenv";
import { createClient } from "@libsql/client";
configDotenv();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function getAllMessagesByChatId(id) {

  try {
    const mensajes = await client.execute({
      sql: "SELECT * FROM Mensaje WHERE id_chat = ?",
      args: [id]
    });

    if (mensajes.rows.length > 0) return mensajes.rows; 

    return false; 

  } catch(e) {
    return false; 
  }

}

export async function insertMessage(idMensaje, idChat, texto, usuarioEnvia, usuarioRecibe, fecha) {
  try {
    const result = await client.execute({
      sql: "INSERT INTO Mensaje (id_mensaje, id_chat, texto, usuario_envia, usuario_recibe, fecha) VALUES (?, ?, ?, ?, ?, ?)",
      args: [idMensaje, idChat, texto, usuarioEnvia, usuarioRecibe, fecha]
    });

    return result; 

  } catch(e) {
    return false; 
  }
}

export async function getFavoritesByUserId(idUsuario) {
  try {
    const favorites = await client.execute({
      sql: "SELECT * FROM Mensaje WHERE favorito = 1 AND usuario_recibe = ?",
      args: [idUsuario]
    }); 

    if (favorites.rows.length > 0) return favorites.rows; 

    return false; 

  } catch (e) {
    return false; 
  }
}

export async function addToFavorites(idMensaje) {
  try {

    const result = await client.execute({
      sql: "UPDATE Mensaje SET favorito = 1 WHERE id_mensaje = ?",
      args: [idMensaje]
    }); 

    return result;

  } catch(e) {
    return false; 
  }
}