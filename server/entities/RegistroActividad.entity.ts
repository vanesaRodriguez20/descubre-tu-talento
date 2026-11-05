import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index
} from 'typeorm';
import { Usuario } from './Usuario.entity';

/**
 * Registro de telemetría de juego y aprendizaje cognitivo.
 * El motor Lumy evalúa cómo aprende el niño (tiempo de respuesta, intentos,
 * resiliencia, perseverancia ante la frustración) más allá del simple acierto o fallo.
 */
@Entity('registros_actividad')
export class RegistroActividad {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.registrosActividad, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'estudianteId' })
  estudiante!: Usuario;

  @Index()
  @Column({ type: 'uuid' })
  estudianteId!: string;

  @Column({ type: 'varchar', length: 100 })
  codigoActividad!: string; // ej. 'fracciones_pizza', 'balanza_algebra'

  @Column({ type: 'varchar', length: 60 })
  categoria!: 'matematicas' | 'crear' | 'deporte' | 'aprender' | 'ayudar';

  @Column({ type: 'boolean' })
  completadaExito!: boolean;

  /**
   * Tiempo total dedicado al ejercicio en milisegundos
   */
  @Column({ type: 'int' })
  tiempoDedicadoMs!: number;

  /**
   * Número de reintentos antes de conseguir la solución correcta
   */
  @Column({ type: 'int', default: 0 })
  numeroIntentosFallidos!: number;

  /**
   * Cuántas veces el niño consultó o escuchó pistas de Lumy
   */
  @Column({ type: 'int', default: 0 })
  pistasSolicitadasLumy!: number;

  /**
   * Índice de Resiliencia calculado (0 a 100):
   * Mide la tenacidad y autorregulación del estudiante al encontrarse con obstáculos
   * (intentar de nuevo con entusiasmo en vez de abandonar inmediatamente).
   */
  @Column({ type: 'float', default: 50.0 })
  indiceResiliencia!: number;

  /**
   * Nivel de dificultad ZPD inicial vs ajustado durante la sesión
   */
  @Column({ type: 'float' })
  dificultadZPDInicial!: number;

  @Column({ type: 'float' })
  dificultadZPDFinal!: number;

  /**
   * Telemetría de interacción detallada (clics, movimientos, selección de rebanadas o pesos)
   */
  @Column({
    type: 'jsonb',
    nullable: true
  })
  telemetriaInteracciones?: {
    eventos: { tipo: string; timestampMs: number; valor?: any }[];
    tiempoReflexionAntesDeResponderMs: number;
    abandonoPrematuro: boolean;
  };

  /**
   * Informe cualitativo redactado por la IA de Lumy
   */
  @Column({
    type: 'jsonb',
    nullable: true
  })
  evaluacionCualitativaLumy?: {
    talentoDestacado: string;
    mensajeAlentador: string;
    observacionPedagogicaDocente: string;
    recomendacionZPD: string;
  };

  @CreateDateColumn()
  fechaRegistro!: Date;
}
