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

export enum TipoAlertaDocente {
  TALENTO_DESCUBIERTO = 'talento_descubierto',
  SEGURIDAD_IA = 'seguridad_ia',
  DIFICULTAD_REITERADA = 'dificultad_reiterada',
  ALTA_RESILIENCIA = 'alta_resiliencia',
  ENTREGA_COMPLETADA = 'entrega_completada'
}

export enum NivelSeveridad {
  INFORMATIVA = 'informativa',
  PEDAGOGICA = 'pedagogica',
  URGENTE = 'urgente'
}

/**
 * Notificaciones y alertas inteligentes para el docente generadas automáticamente por Lumy
 */
@Entity('notificaciones_docente')
export class NotificacionDocente {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.notificacionesRecibidas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'docenteId' })
  docente!: Usuario;

  @Index()
  @Column({ type: 'uuid' })
  docenteId!: string;

  /**
   * Alumno relacionado con la alerta (anonimizado por alias)
   */
  @Column({ type: 'varchar', length: 60 })
  aliasEstudiante!: string;

  @Column({
    type: 'enum',
    enum: TipoAlertaDocente
  })
  tipoAlerta!: TipoAlertaDocente;

  @Column({
    type: 'enum',
    enum: NivelSeveridad,
    default: NivelSeveridad.INFORMATIVA
  })
  severidad!: NivelSeveridad;

  @Column({ type: 'varchar', length: 150 })
  titulo!: string;

  @Column({ type: 'text' })
  descripcionDetallada!: string;

  /**
   * Sugerencia de acción pedagógica para la docente
   */
  @Column({ type: 'text', nullable: true })
  recomendacionPedagogica?: string;

  @Column({ type: 'boolean', default: false })
  leida!: boolean;

  @CreateDateColumn()
  fechaCreacion!: Date;
}
