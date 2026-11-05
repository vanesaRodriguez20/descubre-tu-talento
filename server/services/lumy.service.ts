/**
 * Motor de Inteligencia Artificial "Lumy"
 * Arquitectura de 3 capas:
 * 1. Evaluador de Talentos y Resiliencia Cognitiva (análisis de telemetría más allá de acierto/error)
 * 2. Motor de Dificultad Adaptativa (Zona de Desarrollo Próximo - Vygotsky / ZPD)
 * 3. Tutor Socrático y Filtro de Seguridad Infantil (STT/TTS adaptado para 6-12 años)
 */

export interface TelemetriaSesion {
  codigoActividad: string;
  categoria: string;
  tiempoTotalMs: number;
  intentosFallidos: number;
  pistasSolicitadas: number;
  completadaExito: boolean;
  edadEstudianteAprox?: number; // 6-12 años
}

export interface ResultadoEvaluacionTalento {
  talentoDetectado: string;
  puntuacionZPD: number;
  indiceResiliencia: number;
  mensajeAlentador: string;
  observacionDocente: string;
  recomendacionProximoReto: string;
  desbloqueaMedalla?: {
    id: string;
    titulo: string;
    icono: string;
    habilidad: string;
    descripcionParaPadres: string;
  };
}

export interface RespuestaSocratica {
  textoRespuesta: string;
  pistaConceptual: string;
  audioTTSPrompt: string;
  tonoVoz: 'calido_alentador' | 'curioso_entusiasmado' | 'orientador_calmado';
  alertaSeguridad: boolean;
  motivoAlerta?: string;
  notificarDocente?: boolean;
}

export class LumyAIEngine {
  /**
   * 1. Evaluador de Talentos y Resiliencia
   */
  public static evaluarSesion(telemetria: TelemetriaSesion): ResultadoEvaluacionTalento {
    const { tiempoTotalMs, intentosFallidos, pistasSolicitadas, completadaExito } = telemetria;
    const segundos = Math.round(tiempoTotalMs / 1000);

    // Cálculo del índice de resiliencia (capacidad de reintentar sin frustración)
    let resiliencia = 70;
    if (intentosFallidos > 0 && completadaExito) {
      // Intentó varias veces y no se rindió hasta lograrlo: ¡Alta resiliencia!
      resiliencia = Math.min(100, 75 + intentosFallidos * 8);
    } else if (intentosFallidos > 3 && !completadaExito) {
      // Necesita andamiaje pedagógico
      resiliencia = 55;
    }

    // Ajuste de Zona de Desarrollo Próximo (ZPD)
    let ajusteZPD = 3.0;
    if (completadaExito && intentosFallidos === 0 && segundos < 40) {
      // Demasiado fácil para el niño -> Elevar reto
      ajusteZPD = 4.2;
    } else if (completadaExito && intentosFallidos <= 2) {
      // En la zona óptima de aprendizaje (Flow)
      ajusteZPD = 3.5;
    } else if (!completadaExito) {
      // Ajustar hacia abajo para evitar frustración
      ajusteZPD = 2.4;
    }

    let talento = 'Pensamiento Lógico y Perseverancia';
    let medalla = undefined;

    if (telemetria.categoria === 'matematicas') {
      if (resiliencia >= 85) {
        talento = 'Gran Resiliencia y Deducción Matemática';
        medalla = {
          id: 'resiliencia_dorada',
          titulo: 'Mente Imparable',
          icono: '🛡️',
          habilidad: 'Resiliencia ante Desafíos',
          descripcionParaPadres:
            'Tu hijo demostró una enorme constancia: ante una balanza desequilibrada, en lugar de frustrarse, probó tres hipótesis distintas hasta comprender la regla.'
        };
      } else {
        talento = 'Intuición Espacial y Fracciones';
        medalla = {
          id: 'geometria_creativa',
          titulo: 'Ojo de Arquitecto',
          icono: '📐',
          habilidad: 'Percepción Espacial',
          descripcionParaPadres:
            'Comprende las relaciones entre las partes y el todo de manera visual, anticipando cortes y equivalencias con soltura.'
        };
      }
    }

    return {
      talentoDetectado: talento,
      puntuacionZPD: Number(ajusteZPD.toFixed(1)),
      indiceResiliencia: Math.round(resiliencia),
      mensajeAlentador:
        intentosFallidos > 0
          ? '¡Increíble perseverancia! No te diste por vencido y cada intento te enseñó algo nuevo. ¡Así piensan los grandes científicos!'
          : '¡Qué gran velocidad de deducción! Resolviste el acertijo encontrando el patrón a la primera.',
      observacionDocente: `El estudiante completó la actividad en ${segundos}s con ${intentosFallidos} reintentos y ${pistasSolicitadas} pistas. Su índice de resiliencia fue de ${Math.round(
        resiliencia
      )}/100, manteniéndose en zona de aprendizaje activo.`,
      recomendacionProximoReto:
        ajusteZPD > 3.5
          ? 'Presentar retos de tres variables con balanzas compuestas o fracciones mixtas.'
          : 'Reforzar equivalencias visuales con pistas guiadas antes de aumentar la dificultad.',
      desbloqueaMedalla: medalla
    };
  }

  /**
   * 2. Tutor Socrático y Filtro de Seguridad Infantil
   */
  public static procesarInteraccionConversacional(
    mensajeEstudiante: string,
    contextoActividad: string,
    edadNino: number = 8
  ): RespuestaSocratica {
    const textoLimpio = mensajeEstudiante.trim().toLowerCase();

    // Filtros de Seguridad Estrictos para la Infancia (Child Safety Guardrails)
    const patronesInapropiados = [
      /\b(direccion|donde vivo|mi telefono|numero de telefono|mi clave|mi tarjeta|mi casa)\b/i,
      /\b(odio|tonto|matar|morir|feo|idiota|pelear|golpear)\b/i,
      /\b(adulto|secreto|no le digas a nadie|privado)\b/i
    ];

    for (const patron of patronesInapropiados) {
      if (patron.test(textoLimpio)) {
        return {
          textoRespuesta:
            'En LUM cuidamos tu seguridad y la de todos tus amigos. Recordemos mantener nuestras conversaciones enfocadas en los juegos, el arte y las matemáticas. ¿Regresamos al reto?',
          pistaConceptual: 'Filtro de seguridad activado: Redirección pedagógica amable.',
          audioTTSPrompt:
            'En LUM cuidamos tu seguridad. Volvamos juntos a nuestro reto educativo, ¿de acuerdo?',
          tonoVoz: 'orientador_calmado',
          alertaSeguridad: true,
          motivoAlerta: 'Patrón de datos personales o vocabulario sensible detectado en consulta del menor.',
          notificarDocente: true
        };
      }
    }

    // Respuestas Socráticas según contexto (Da pistas para pensar, nunca la respuesta masticada)
    if (contextoActividad.includes('fraccion') || textoLimpio.includes('fraccion') || textoLimpio.includes('pizza')) {
      return {
        textoRespuesta:
          '¡Buena pregunta! Si divides una pizza entera en 4 rebanadas iguales y te comes 2... ¿Qué parte de la pizza queda en el plato? ¿Será la mitad? Imagínalo en tu mente o arrastra las rebanadas.',
        pistaConceptual: 'Relación 2/4 = 1/2 mediante partición visual.',
        audioTTSPrompt:
          'Si divides la pizza en cuatro partes y tomas dos, ¿cuánto te queda? ¡Exacto, la mitad!',
        tonoVoz: 'curioso_entusiasmado',
        alertaSeguridad: false
      };
    }

    if (contextoActividad.includes('balanza') || textoLimpio.includes('balanza') || textoLimpio.includes('pesar')) {
      return {
        textoRespuesta:
          'Fíjate en el brazo de la balanza: si el lado izquierdo está más abajo, significa que pesa más. ¿Qué número puedes sumar en el lado derecho para que ambos platos queden a la misma altura?',
        pistaConceptual: 'Conservación de la igualdad algebraica ($A + X = B$).',
        audioTTSPrompt:
          'Mira hacia dónde se inclina la balanza. ¿Qué peso necesitas colocar para que quede en perfecto equilibrio?',
        tonoVoz: 'calido_alentador',
        alertaSeguridad: false
      };
    }

    // Respuesta socrática general para mantener el entusiasmo
    return {
      textoRespuesta:
        '¡Qué curiosidad tan brillante tienes! Recuerda que no hay errores, solo descubrimientos en el camino. ¿Qué pista ves en el dibujo que te llame la atención?',
      pistaConceptual: 'Estimulación del razonamiento visual y deductivo.',
      audioTTSPrompt:
        '¡Qué buena pregunta! Mira los detalles en la pantalla y cuéntame qué descubres.',
      tonoVoz: 'calido_alentador',
      alertaSeguridad: false
    };
  }
}
