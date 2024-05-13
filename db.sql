CREATE TABLE Usuario (
	id_usuario TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  clave TEXT NOT NULL,
  correo TEXT UNIQUE NOT NULL,
  img_perfil TEXT
);

CREATE TABLE Chat (
  id_chat TEXT PRIMARY KEY, 
  id_usuario1 TEXT NOT NULL,
  id_usuario2 TEXT NOT NULL,
  FOREIGN KEY (id_usuario1) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario2) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
); 

CREATE TABLE Mensaje (
  id_mensaje TEXT PRIMARY KEY,
  id_chat TEXT NOT NULL, 
  texto TEXT NOT NULL,
  usuario_envia TEXT NOT NULL,
  usuario_recibe TEXT NOT NULL,
  fecha TEXT NOT NULL, 
  favorito BOOLEAN DEFAULT 0,
  FOREIGN KEY (usuario_envia) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (usuario_recibe) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
);
