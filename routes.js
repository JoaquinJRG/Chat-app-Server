import express from "express"; 
import { getAllUsuarios, addImg, createUsuario, existsUsuario, getImgById, deleteUser } from "./models/usuario.js";
import { createChat, getChatsByUser1Id, getChatsByUser2Id } from "./models/chat.js"; 
import { getAllMessagesByChatId, insertMessage, addToFavorites, removeFromFavorites, getFavoritesByUserId } from "./models/mensaje.js";
import multer from "multer";
import fs from "node:fs"; 
const upload = multer({dest: "uploads/"}); 
const router = express.Router(); 

router.get("/usuarios", async (req, res) => {
  const usuarios = await getAllUsuarios(); 

  res.json(usuarios);
}); 

router.get("/img/:id", async (req, res) => {
  const idUsuario = req.params.id; 
  const img = await getImgById(idUsuario);
  
  res.json(img); 

}); 

router.get("/myCreateChats/:id", async (req, res) => {
  const id = req.params.id; 
  const chatData1 = await getChatsByUser1Id(id); 
  const chatData2 = await getChatsByUser2Id(id); 

  // Verifica si las funciones devolvieron un array o false
  const chatData = [];

  if (Array.isArray(chatData1)) {
    chatData.push(...chatData1); // Agrega los elementos del primer array
  }
  
  if (Array.isArray(chatData2)) {
    chatData.push(...chatData2); // Agrega los elementos del segundo array
  }

  res.json(chatData);

});

router.get("/chatMessages/:idChat", async (req, res) => {
  const idChat = req.params.idChat; 
  const chats = await getAllMessagesByChatId(idChat); 
  res.json(chats); 
});

router.get("/addToFavorites/:idMensaje", async (req, res) => {
  const idMensaje = req.params.idMensaje; 
  const result = await addToFavorites(idMensaje);
  res.json(result);
});

router.get("/removeFromFavorites/:idMensaje", async (req, res) => {
  const idMensaje = req.params.idMensaje; 
  const result = await removeFromFavorites(idMensaje);
  res.json(result);
});


router.get("/favorites/:idUsuario", async (req, res) => {
  const idUsuario = req.params.idUsuario; 
  const favoritos = await getFavoritesByUserId(idUsuario);
  res.json(favoritos); 
});

//POST 
router.post("/createUsuario", async (req, res) => {
  const data = req.body; 
  const usuario = await createUsuario(data.name, data.password, data.email); 
  res.json(usuario); 
});

router.post("/signIn", async (req, res) => {
  const data = req.body; 
  const usuario = await existsUsuario(data.email, data.password); 
  res.json(usuario); 

}); 

router.post("/createChat", async (req, res) => {
  const data = req.body; 
  const chat = await createChat(data.idUser1, data.idUser2);

  if (chat) {
    res.json("Chat creado")
  } else {
    res.json("Error") 
  }

}); 

router.post("/addImg", upload.single("img"), async (req, res) => {
  const img = req.file; 
  const id = req.body.id; 
  const imgData = fs.readFileSync(img.path);
  fs.unlinkSync(img.path);
  const result = await addImg(imgData, id); 

  res.json(result); 
});

//Delete 
router.delete("/deleteUser/:id", async (req, res) => {
  const idUsuario = req.params.id; 
  const result = await deleteUser(idUsuario); 
  res.json(result); 
}); 

export default router; 