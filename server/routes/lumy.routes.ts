import { Router, Request, Response } from 'express';
import { LumyAIEngine } from '../services/lumy.service';

export const lumyRouter = Router();

// Endpoint para evaluación de talentos y resiliencia tras completar una actividad
lumyRouter.post('/evaluar-sesion', (req: Request, res: Response) => {
  try {
    const { codigoActividad, categoria, tiempoTotalMs, intentosFallidos, pistasSolicitadas, completadaExito } = req.body;

    const evaluacion = LumyAIEngine.evaluarSesion({
      codigoActividad: codigoActividad || 'actividad_desconocida',
      categoria: categoria || 'matematicas',
      tiempoTotalMs: Number(tiempoTotalMs) || 30000,
      intentosFallidos: Number(intentosFallidos) || 0,
      pistasSolicitadas: Number(pistasSolicitadas) || 0,
      completadaExito: Boolean(completadaExito)
    });

    res.json({
      exito: true,
      data: evaluacion
    });
  } catch (err: any) {
    res.status(500).json({ exito: false, error: err.message });
  }
});

// Endpoint para el diálogo socrático de voz con Lumy
lumyRouter.post('/dialogo-socrático', (req: Request, res: Response) => {
  try {
    const { mensaje, contexto, edad } = req.body;

    const respuesta = LumyAIEngine.procesarInteraccionConversacional(
      mensaje || '',
      contexto || '',
      edad || 8
    );

    res.json({
      exito: true,
      data: respuesta
    });
  } catch (err: any) {
    res.status(500).json({ exito: false, error: err.message });
  }
});
