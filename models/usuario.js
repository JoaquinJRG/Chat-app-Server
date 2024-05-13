import { configDotenv } from "dotenv"; 
import { createClient } from "@libsql/client";
configDotenv(); 

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});


export async function getAllUsuarios() {
  const result = await client.execute("SELECT * FROM Usuario"); 
  return result.rows; 
}

export async function getUsuarioById(idUsuario) {
  const result = await client.execute({
    sql: "SELECT * FROM Usuario WHERE id_usuario = ?",
    args: [idUsuario]
  });

  return result.rows;
}

export async function createUsuario(nombre, clave, correo) {

  const idUsuario = crypto.randomUUID(); 

  try {
    const result = await client.execute({
      sql: "INSERT INTO Usuario (id_usuario, nombre, clave, correo) VALUES (?,?,?,?)",
      args: [idUsuario, nombre, clave, correo]
    });

    return result;

  } catch(error) {
    return false; 
  } 
}

export async function existsUsuario(correo, clave) {
  try {
    const result = await client.execute({
      sql : "SELECT id_usuario, nombre, correo FROM Usuario WHERE correo = ? AND clave = ?",
      args: [correo, clave]
    });

    if (result.rows.length > 0) {
      return result.rows;
    } else {
      return false; 
    }

  } catch (error) {
    return false; 
  }
}

export async function getImgById(idUsuario) {
  const result = await client.execute({
    sql: "SELECT img_perfil FROM Usuario WHERE id_usuario = ?",
    args: [idUsuario]
  });

  return result.rows; 
}

export async function addImg(img, idUsuario) {

  // Convirtiendo el búfer de datos binarios en un objeto Buffer y el bufer a un string en base 64
  const imgBuffer = Buffer.from(img); 
  const imgBase64 = imgBuffer.toString("base64"); 

  const result = await client.execute({
    sql: "UPDATE Usuario SET img_perfil = ? WHERE id_usuario = ?", 
    args: [imgBase64, idUsuario]
  }); 

  return result; 
}


