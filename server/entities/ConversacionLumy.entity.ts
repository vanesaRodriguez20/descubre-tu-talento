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
 * Registro de sesiones conversacionales bidireccionales con Lumy.
 * Lumy actúa como tutor socrático (guía con preguntas, nunca da respuestas directas)
 * y cuenta con filtro de seguridad infantil que notifica al docente ante temas inapropiados.
 */
@Entity('conversaciones_lumy')
export class ConversacionLumy {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.conversacionesLumy, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'estudianteId' })
  estudiante!: Usuario;

  @Index()
  @Column({ type: 'uuid' })
  estudianteId!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  contextoActividad?: string; // ej. 'fracciones_pizza_pregunta_3'

  /**
   * Tipo de entrada: 'voz_stt' o 'texto'
   */
  @Column({ type: 'varchar', length: 20, default: 'voz_stt' })
  canalEntrada!: 'voz_stt' | 'texto';

  /**
   * Transcripción del audio del niño procesada por STT
   */
  @Column({ type: 'text' })
  mensajeEstudiante!: string;

  /**
   * Respuesta de voz y texto generada por Lumy (tutor socrático)
   */
  @Column({ type: 'text' })
  respuestaSocraticaLumy!: string;

  /**
   * Pista conceptual o analogía utilizada
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  pistaUtilizada?: string;

  /**
   * Indicador si el filtro de seguridad de protección al menor fue activado
   */
  @Column({ type: 'boolean', default: false })
  alertaSeguridadDisparada!: boolean;

  /**
   * Categoría de seguridad detectada (ej. 'datos_personales', 'contenido_inapropiado', 'lenguaje_ofensivo')
   */
  @Column({ type: 'varchar', length: 80, nullable: true })
  motivoAlertaSeguridad?: string;

  @CreateDateColumn()
  fechaHora!: Date;
}
