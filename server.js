// 1. Cargar las librerías
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Carga el archivo .env
const cors = require('cors'); // Carga cors

// DEFINE AQUÍ TU DOMINIO COMPLETO DE GITHUB PAGES
// (Reemplaza 'https://tebias-cloud.github.io' con la URL base de tu página si es diferente)
const allowedOrigin = 'https://tebias-cloud.github.io/GamerVault/'; 

// 2. Configurar el servidor
const app = express();
app.use(express.json()); // Permite que el servidor entienda JSON

// Configuración avanzada de CORS para permitir SÓLO tu dominio de GitHub Pages
app.use(cors()); 

// 3. Configurar la IA de Google
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Usamos gemini-pro (es el modelo correcto para esta librería)
// CAMBIAMOS a la versión que el Vercel antiguo debe reconocer
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// 4. Crear el "endpoint" (la ruta) que el chat usará
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.mensaje;

        // ¡Importante! Aquí le das la personalidad y el contexto
        const prompt = `
            Eres 'Vault-Bot', un asistente experto en videojuegos 
            de la tienda GamerVault. Eres amable, servicial y 
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
        console.error('Error de API o Clave:', error);
        // Devolvemos un error 500 para el Front-End
        res.status(500).json({ respuesta: "Error: No pude conectar con la IA. Asegúrate de que la clave API esté activa." });
    }
});

// 7. Iniciar el servidor
// Vercel y Render automáticamente proveen el puerto en la variable de entorno PORT
const port = process.env.PORT || 3000; 
app.listen(port, () => {
    console.log(`Servidor escuchando en puerto ${port}. Dominio CORS permitido: ${allowedOrigin}`);
});