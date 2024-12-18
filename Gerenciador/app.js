const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const produtoRoutes = require('./routes/produtoRoute');  
const upload = require("./multerConfig");
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connection.once('open', () => {
  console.log('Conectado ao MongoDB');
});


const conectarMongoDB = async () => {
  try {
    const uri = process.env.CONECTAR_SENHA;
    if (!uri) {
      console.error('Erro: a variável MONGO_SENHA não está definida no arquivo .env');
      process.exit(1); 
    }

    await mongoose.connect(uri);
    console.log('Conectado ao MongoDB Atlas com sucesso!');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err.message);
    process.exit(1); 
  }
};

conectarMongoDB();


app.use('/api/produtos', produtoRoutes);    
app.use("/uploads", express.static(path.join(__dirname, "upload")));
app.post("/upload", upload.single("photo"), (req, res) => {
 
  if (!req.file) {
    return res.status(400).send("Nenhum arquivo foi enviado.");
  }

  res.status(200).send({
    message: "Arquivo enviado!",
    file: req.file, 
  });
});       

app.get('/', (req, res) => {
  res.send('API de Produtos funcionando!');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


