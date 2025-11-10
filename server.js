// 1. Cargar las librerías
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Carga el archivo .env
const cors = require('cors'); // Carga cors

// 2. Configurar el servidor
const app = express();
app.use(express.json()); // Permite que el servidor entienda JSON
app.use(cors()); // Permite peticiones de otros dominios (tu GitHub Pages)

// 3. Configurar la IA de Google
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// ESTA ES LA LÍNEA CORRECTA:
// LA LÍNEA CORRECTA Y ESTABLE:
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// 4. Crear el "endpoint" (la ruta) que el chat usará
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.mensaje;

    // ¡Importante! Aquí le das la personalidad y el contexto
    const prompt = `
      Eres 'Vault-Bot', un asistente experto en videojuegos 
      de la tienda GameVault. Eres amable, servicial y 
      te especializas en nuestros productos.

      El usuario pregunta: "${userMessage}"
    `;

    // 5. Llamar a la IA
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();

    // 6. Devolver la respuesta al Front-End
    res.json({ respuesta: aiText });

  } catch (error) {
    console.error(error);
    res.status(500).json({ respuesta: "Error: No pude pensar una respuesta." });
  }
});

// 7. Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});  