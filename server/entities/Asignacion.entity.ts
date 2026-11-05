import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index
} from 'typeorm';
import { Usuario } from './Usuario.entity';

export enum EstadoAsignacion {
  PENDIENTE = 'pendiente',
  EN_PROGRESO = 'en_progreso',
  ENTREGADA = 'entregada',
  EVALUADA = 'evaluada'
}

export enum TipoAmbitoAsignacion {
  INDIVIDUAL = 'individual',
  GRUPO_AULA = 'grupo_aula'
}

/**
 * Representa una misión o tarea educativa creada por un docente para sus alumnos
 * con fecha límite obligatoria, retroalimentación motivadora y seguimiento de progreso.
 */
@Entity('asignaciones')
export class Asignacion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  tituloActividad!: string;

  @Column({ type: 'text' })
  descripcionPedagogica!: string;

  @Column({ type: 'varchar', length: 60 })
  categoria!: 'matematicas' | 'crear' | 'deporte' | 'aprender' | 'ayudar';

  @Column({
    type: 'enum',
    enum: TipoAmbitoAsignacion,
    default: TipoAmbitoAsignacion.INDIVIDUAL
  })
  tipoAmbito!: TipoAmbitoAsignacion;

  /**
   * Identificador del juego o simulador (ej. 'fracciones_pizza', 'balanza_algebraica', 'patrones_logicos')
   */
  @Column({ type: 'varchar', length: 100 })
  codigoJuego!: string;

  /**
   * Nivel de dificultad adaptado para esta asignación (1 a 5)
   */
  @Column({ type: 'int', default: 1 })
  nivelDificultad!: number;

  /**
   * Docente que creó la asignación
   */
  @ManyToOne(() => Usuario, (usuario) => usuario.asignacionesCreadas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'docenteCreadorId' })
  docenteCreador!: Usuario;

  @Index()
  @Column({ type: 'uuid' })
  docenteCreadorId!: string;

  /**
   * Estudiante asignado (si es individual)
   */
  @ManyToOne(() => Usuario, (usuario) => usuario.asignacionesRecibidas, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'estudianteAsignadoId' })
  estudianteAsignado?: Usuario;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  estudianteAsignadoId?: string;

  /**
   * Fecha de entrega obligatoria configurada por el docente
   */
  @Column({ type: 'timestamp with time zone' })
  fechaLimiteEntrega!: Date;

  @Column({
    type: 'enum',
    enum: EstadoAsignacion,
    default: EstadoAsignacion.PENDIENTE
  })
  estado!: EstadoAsignacion;

  /**
   * Fecha en que el estudiante completó y envió la misión
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  fechaEnvioEstudiante?: Date;

  /**
   * Respuesta conceptual, dibujo o solución entregada por el menor
   */
  @Column({ type: 'text', nullable: true })
  solucionEntregada?: string;

  /**
   * Mensaje motivador pedagógico redactado por el docente al evaluar
   */
  @Column({ type: 'text', nullable: true })
  mensajeMotivadorDocente?: string;

  /**
   * Calificación formativa con estrellas (1 a 5 estrellas)
   */
  @Column({ type: 'int', nullable: true })
  calificacionEstrellas?: number;

  @CreateDateColumn()
  fechaCreacion!: Date;

  @UpdateDateColumn()
  fechaActualizacion!: Date;
}
