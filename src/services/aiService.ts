import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializar el cliente de Google AI
export const initAIClient = (apiKey: string) => {
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
};

// Procesar mensajes con IA
export const processWithAI = async (
  model: any, 
  userInput: string, 
  contextualInfo: string
): Promise<string> => {
  if (!model) {
    return "Lo siento, no puedo procesar tu pregunta en este momento. ¿Te gustaría ver la información básica de nuestra colección?";
  }

  try {
    const prompt = `
    Eres un asistente especializado en NFTs del Museo de Arte Contemporáneo de Quintana Roo.
    Aquí está la información de nuestra colección:
    ${contextualInfo}

    Pregunta del usuario: ${userInput}

    Por favor, responde de manera concisa y específica, usando solo la información proporcionada.
    Si no tienes la información exacta, indícalo claramente.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || "No pude generar una respuesta. ¿Te gustaría ver la información básica de nuestra colección?";
  } catch (error) {
    console.error('Error al procesar con AI:', error);
    return "Hubo un error al procesar tu pregunta. ¿Te gustaría ver la información básica de nuestra colección?";
  }
};
