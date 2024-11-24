import axios, { AxiosError } from 'axios';
import { VALID_CATEGORIES, ShoeCategory } from '../types';

const AZURE_ENDPOINT = 'https://iapaylesscase-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/c9947849-b882-4295-ad3f-bae5005eff73/classify/iterations/AIPayless/image';
const PREDICTION_KEY = '2iStAXJK5CXOCJqJE2raj2sWBcIogqb7ENCZzxQTgbABmqk2CujqJQQJ99AKACYeBjFXJ3w3AAAIACOGWvrz';

export async function classifyImage(file: File): Promise<ShoeCategory> {
  try {
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('El tamaño del archivo excede el límite de 10MB');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Tipo de archivo inválido. Por favor, sube una imagen');
    }

    const arrayBuffer = await file.arrayBuffer();
    const response = await axios.post(AZURE_ENDPOINT, arrayBuffer, {
      headers: {
        'Prediction-Key': PREDICTION_KEY,
        'Content-Type': 'application/octet-stream',
      },
    });

    if (!response.data?.predictions?.length) {
      throw new Error('No se recibieron predicciones de la API');
    }

    const topPrediction = response.data.predictions.reduce(
      (prev: any, current: any) => (prev.probability > current.probability ? prev : current)
    );

    if (topPrediction.probability < 0.5) {
      throw new Error('No se pudo clasificar la imagen con suficiente confianza');
    }

    const predictedCategory = topPrediction.tagName.toLowerCase();
    
    if (!VALID_CATEGORIES.includes(predictedCategory as ShoeCategory)) {
      throw new Error(`Categoría no válida: ${predictedCategory}`);
    }

    return predictedCategory as ShoeCategory;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 413) {
        throw new Error('El archivo de imagen es demasiado grande');
      }
      if (error.response?.status === 429) {
        throw new Error('Demasiadas solicitudes. Por favor, intenta más tarde');
      }
      throw new Error(`Error de API: ${error.response?.data?.message || 'Error al clasificar la imagen'}`);
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Error al clasificar la imagen');
  }
}