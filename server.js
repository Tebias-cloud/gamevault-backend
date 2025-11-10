// 1. Cargar las librerías
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Carga el archivo .env
const cors = require('cors'); // Carga cors

// 2. Configurar el servidor
const app = express();
app.use(express.json()); // Permite que el servidor entienda JSON

// *** CONFIGURACIÓN DE CORS FINAL Y CORRECTA ***
// Usamos el comodín (app.use(cors())) para eliminar cualquier bloqueo por dominio.
app.use(cors()); 

// 3. Configurar la IA de Google (Obtiene la clave de las variables de Vercel)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Usamos gemini-2.5-flash (el modelo más nuevo que la librería antigua puede reconocer)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

// 4. Crear el "endpoint" (la ruta) que el chat usará
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.mensaje;

        // Definición de la personalidad del bot para el modelo de IA
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

        // 6. Devuelve la respuesta al Front-End
        res.json({ respuesta: aiText });

    } catch (error) {
        console.error('Error de API o Clave:', error);
        // Devuelve un error 500 para el Front-End (ya que el problema es la clave)
        res.status(500).json({ respuesta: "Error: No pude conectar con la IA. Por favor, revisa la clave API." });
    }
});

// 7. Iniciar el servidor
const port = process.env.PORT || 3000; 
app.listen(port, () => {
    // Nota: El console.log que intentaba imprimir allowedOrigin ha sido eliminado.
    console.log(`Servidor escuchando en puerto ${port}. Listo.`);
});