# Arquitectura de Software y Estructura del Proyecto LUM

## 1. Visión General de la Arquitectura
**LUM** es una plataforma web educativa gamificada e inclusiva orientada a niños de 6 a 12 años y docentes, construida con principios de:
- **Privacidad por Defecto (Privacy by Design - COPPA / FERPA / GDPR-K)**: Alumnos anonimizados sin correo electrónico, autenticación mediante Alias y PIN (Numérico y Visual por figuras).
- **Inclusión y Accesibilidad Universal (WCAG 2.2 AA / AAA)**: Tipografía para dislexia, temas de alto contraste, lectura por voz (TTS), dictado por voz (STT), modo calmo y regla guía de lectura visual.
- **Tutor Inteligente Socrático ("Lumy")**: Evaluación continua de telemetría (resiliencia, tiempo de respuesta, reintentos) y ajuste de Zona de Desarrollo Próximo (ZPD) con filtros de seguridad infantil.

---

## 2. Estructura Completa de Carpetas (Frontend y Backend)

```text
lum-platform/
├── docs/                                # Documentación de arquitectura y guías
│   ├── architecture.md                  # Especificación técnica y modelos
│   └── api-spec.md                      # Endpoints REST y contratos de datos
├── server/                              # BACKEND (Node.js + Express + TypeORM + PostgreSQL)
│   ├── config/                          # Configuraciones de entorno y seguridad
│   │   ├── database.ts                  # Configuración de conexión PostgreSQL
│   │   └── security.ts                  # Políticas CORS, Rate Limiting y Helmet
│   ├── data-source.ts                   # Instancia DataSource de TypeORM y migraciones
│   ├── entities/                        # Modelos de Entidad TypeORM (ORM)
│   │   ├── Usuario.entity.ts            # Entidad Docente y Alumno (Privacidad por defecto)
│   │   ├── EstudiantePerfil.entity.ts   # Gamificación, Avatar, ZPD y Accesibilidad
│   │   ├── Asignacion.entity.ts         # Misiones con fecha límite y feedback docente
│   │   ├── RegistroActividad.entity.ts  # Telemetría cognitiva y resiliencia del menor
│   │   ├── NotificacionDocente.entity.ts # Alertas de talentos y seguridad infantil
│   │   └── ConversacionLumy.entity.ts   # Sesiones socráticas STT/TTS anonimizadas
│   ├── middlewares/                     # Middlewares de Express
│   │   ├── auth.middleware.ts           # Verificación de JWT/sesión de roles
│   │   ├── childSafety.middleware.ts    # Filtro de lenguaje y sanitización para menores
│   │   └── errorHandler.middleware.ts   # Captura centralizada de excepciones
│   ├── routes/                          # Rutas de la API RESTful
│   │   ├── auth.routes.ts               # Login docente (email/pass) y alumno (alias/PIN visual)
│   │   ├── student.routes.ts            # Actividades, misiones y entrega de retos
│   │   ├── teacher.routes.ts            # Gestión de alumnos, asignaciones y analítica
│   │   └── lumy.routes.ts               # Evaluación de telemetría y diálogo socrático
│   ├── services/                        # Lógica de Negocio y Servicios de IA
│   │   ├── lumy.service.ts              # Motor ZPD, tutor socrático y evaluador de talentos
│   │   ├── speech.service.ts            # Integración de adaptadores STT/TTS
│   │   ├── student.service.ts           # Progreso y economía de medallas
│   │   └── teacher.service.ts           # Asignación individual y grupal
│   └── migrations/                      # Migraciones versionadas de base de datos
├── src/                                 # FRONTEND (React 19 + TypeScript + Tailwind CSS)
│   ├── assets/                          # Recursos gráficos, ilustraciones e iconos
│   │   └── images/                      # Ilustraciones de Lumy y mundos temáticos
│   ├── components/                      # Componentes UI modulares
│   │   ├── views/                       # Vistas principales del sistema
│   │   │   ├── StudentHomeDashboard.tsx # Pantalla de inicio accesible del estudiante
│   │   │   ├── InicioView.tsx           # Integración del Dashboard del menor
│   │   │   ├── ActividadesView.tsx      # Centro de retos, misiones y filtros
│   │   │   ├── DocenteView.tsx          # Panel de gestión pedagógica y evaluación
│   │   │   ├── LogrosView.tsx           # Medallas y descripciones para padres
│   │   │   ├── MiniEstudioView.tsx      # Lienzo de dibujo, test y xilófono
│   │   │   └── PerfilView.tsx           # Configuración de avatar y apodos
│   │   ├── AccessibilityModal.tsx       # Suite de accesibilidad (dislexia, contraste, etc.)
│   │   ├── Header.tsx                   # Barra superior con búsqueda y accesibilidad
│   │   ├── Sidebar.tsx                  # Menú lateral responsivo por rol
│   │   ├── LoginPortal.tsx              # Portal con PIN Numérico y PIN Visual
│   │   ├── LumyAssistant.tsx            # Asistente estrellita interactiva de voz
│   │   └── MathSimulators.tsx           # Simuladores visuales (Fracciones, Balanza, Patrones)
│   ├── data/                            # Datasets iniciales y catálogo de PIN visual
│   │   └── initialData.ts
│   ├── hooks/                           # Custom React Hooks
│   │   ├── useSpeechRecognition.ts      # Hook de dictado por voz (STT)
│   │   ├── useSpeechSynthesis.ts        # Hook de lectura por voz (TTS)
│   │   └── useAccessibility.ts          # Hook de preferencias de contraste y fuente
│   ├── types/                           # Definiciones de tipos TypeScript compartidos
│   │   └── index.ts
│   ├── utils/                           # Utilidades de audio, síntesis y helpers
│   │   └── audio.ts
│   ├── App.tsx                          # Enrutador principal y control de sesión
│   ├── main.tsx                         # Punto de entrada de la aplicación React
│   └── index.css                        # Estilos globales y tokens Tailwind v4
├── server.ts                            # Entrada del servidor Express Full-Stack
├── package.json                         # Dependencias y scripts de construcción
├── tsconfig.json                        # Configuración estricta de TypeScript con decoradores
└── vite.config.ts                       # Configuración de Vite
```
